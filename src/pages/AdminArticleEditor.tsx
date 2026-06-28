import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  Upload,
  Loader2,
  X,
  Video,
  Image as ImageIcon,
} from "lucide-react";

const categoryOptions = categories.filter((c) => c.key !== "all");

type Status = "draft" | "published";
type MediaType = "image" | "youtube" | "video";

const statusBadgeVariant: Record<Status, "outline" | "default"> = {
  draft: "outline",
  published: "default",
};

export function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYoutubeThumbnail(url: string) {
  const id = getYoutubeId(url);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function getYoutubeEmbed(url: string) {
  const id = getYoutubeId(url);
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}`;
}

export default function AdminArticleEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const { isPublisher } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryKey, setCategoryKey] = useState("algeria");
  const [imageUrl, setImageUrl] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [autoGeneratingThumbnail, setAutoGeneratingThumbnail] = useState(false);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Progress states
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  // Auto‑generate thumbnail when YouTube URL changes
  useEffect(() => {
    if (mediaType === "youtube" && videoUrl) {
      const thumb = getYoutubeThumbnail(videoUrl);
      setVideoThumbnail(thumb || "");
    }
  }, [videoUrl, mediaType]);

  // ---- Helper: generate thumbnail blob from video URL ----
  const generateThumbnailFromVideo = (videoUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = videoUrl;
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const handleLoaded = () => {
        video.currentTime = 0.1;
      };

      const handleSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          }, "image/jpeg", 0.8);
        } catch (err) {
          reject(err);
        } finally {
          video.removeEventListener("loadedmetadata", handleLoaded);
          video.removeEventListener("seeked", handleSeeked);
          video.removeEventListener("error", handleError);
          video.src = "";
          video.load();
        }
      };

      const handleError = () => {
        video.removeEventListener("loadedmetadata", handleLoaded);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("error", handleError);
        reject(new Error("Video failed to load"));
      };

      video.addEventListener("loadedmetadata", handleLoaded);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("error", handleError);
    });
  };

  // ---- Helper: upload a blob as thumbnail ----
  const uploadThumbnailBlob = async (blob: Blob): Promise<string> => {
    const file = new File([blob], `thumbnail-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    setUploadingThumbnail(true);
    setThumbnailProgress(0);
    const ext = "jpg";
    const path = `thumbnails/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("article-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        onProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setThumbnailProgress(percent);
        },
      });

    if (upErr) throw upErr;

    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ---- Image upload ----
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: isRTL ? "ملف غير صالح" : "Invalid file",
        description: isRTL ? "يرجى اختيار صورة" : "Please choose an image",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: isRTL ? "حجم الصورة كبير" : "File too large",
        description: isRTL ? "الحد الأقصى 5 ميغابايت" : "Max 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setImageProgress(0);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("article-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        onProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setImageProgress(percent);
        },
      });

    if (upErr) {
      toast({
        title: "Error",
        description: upErr.message,
        variant: "destructive",
      });
      setUploading(false);
      setImageProgress(0);
      return;
    }

    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
    setImageProgress(100);
    toast({ title: isRTL ? "تم رفع الصورة" : "Image uploaded" });
    setTimeout(() => setImageProgress(0), 2000);
  };

  // ---- Manual thumbnail upload ----
  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: isRTL ? "ملف غير صالح" : "Invalid file",
        description: isRTL
          ? "يرجى اختيار صورة مصغرة"
          : "Please choose an image for thumbnail",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: isRTL ? "حجم الصورة كبير" : "File too large",
        description: isRTL ? "الحد الأقصى 2 ميغابايت" : "Max 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingThumbnail(true);
    setThumbnailProgress(0);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `thumbnails/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("article-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        onProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setThumbnailProgress(percent);
        },
      });

    if (upErr) {
      toast({
        title: "Error",
        description: upErr.message,
        variant: "destructive",
      });
      setUploadingThumbnail(false);
      setThumbnailProgress(0);
      return;
    }

    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setVideoThumbnail(data.publicUrl);
    setUploadingThumbnail(false);
    setThumbnailProgress(100);
    toast({ title: isRTL ? "تم رفع الصورة المصغرة" : "Thumbnail uploaded" });
    setTimeout(() => setThumbnailProgress(0), 2000);
  };

  // ---- Video upload with auto‑thumbnail ----
  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast({
        title: isRTL ? "ملف غير صالح" : "Invalid file",
        description: isRTL ? "يرجى اختيار فيديو" : "Please choose a video",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: isRTL ? "حجم الفيديو كبير" : "File too large",
        description: isRTL
          ? "الحد الأقصى 50 ميغابايت"
          : "Max 50MB – please upload a smaller file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    setVideoProgress(0);
    const ext = file.name.split(".").pop() || "mp4";
    const path = `videos/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("article-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        onProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setVideoProgress(percent);
        },
      });

    if (upErr) {
      let errorMsg = upErr.message;
      if (upErr.message?.toLowerCase().includes("exceeded")) {
        errorMsg = isRTL
          ? "حجم الملف يتجاوز الحد المسموح به في التخزين. يرجى زيادة الحد الأقصى في لوحة تحكم Supabase."
          : "File exceeds the storage limit. Please increase the bucket file size limit in Supabase Dashboard.";
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      setUploadingVideo(false);
      setVideoProgress(0);
      return;
    }

    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    setVideoUrl(publicUrl);
    setUploadingVideo(false);
    setVideoProgress(100);
    toast({ title: isRTL ? "تم رفع الفيديو" : "Video uploaded" });
    setTimeout(() => setVideoProgress(0), 2000);

    // ---- Auto‑generate thumbnail if none exists ----
    if (!videoThumbnail) {
      setAutoGeneratingThumbnail(true);
      try {
        const blob = await generateThumbnailFromVideo(publicUrl);
        const thumbnailUrl = await uploadThumbnailBlob(blob);
        setVideoThumbnail(thumbnailUrl);
        toast({
          title: isRTL ? "تم إنشاء الصورة المصغرة" : "Thumbnail generated",
          description: isRTL
            ? "تم استخراج أول إطار من الفيديو"
            : "First frame extracted from video",
        });
      } catch (err) {
        console.error("Thumbnail generation failed:", err);
        toast({
          title: isRTL ? "فشل إنشاء الصورة المصغرة" : "Thumbnail generation failed",
          description: isRTL
            ? "يرجى رفع صورة يدوياً"
            : "Please upload a thumbnail manually",
          variant: "destructive",
        });
      } finally {
        setAutoGeneratingThumbnail(false);
        setUploadingThumbnail(false);
        setThumbnailProgress(0);
      }
    }
  };

  // ---- Load existing article ----
  useEffect(() => {
    if (isNew || !id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      if (data) {
        setTitle(data.title);
        setExcerpt(data.excerpt ?? "");
        setBody(data.body ?? "");
        setAuthor(data.author ?? "");
        setCategoryKey(data.category_key);
        setImageUrl(data.image_url ?? "");
        setMediaType(data.media_type ?? "image");
        setVideoUrl(data.video_url ?? "");
        setVideoThumbnail(data.video_thumbnail ?? "");
        setIsBreaking(data.is_breaking);
        setIsFeatured(data.is_featured);
        setTagsInput((data.tags ?? []).join(", "));
        setStatus((data.status as Status) ?? "draft");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, toast]);

  const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);

  const requireTitle = () => {
    if (!title.trim()) {
      toast({
        title: isRTL ? "العنوان مطلوب" : "Title is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const buildPayload = (nextStatus: Status) => ({
    title: title.trim(),
    excerpt: excerpt.trim(),
    body,
    author: author.trim(),
    category: selectedCategory?.label ?? "الجزائر",
    category_key: categoryKey,
    media_type: mediaType,
    image_url: mediaType === "image" ? imageUrl.trim() || null : null,
    video_url:
      mediaType === "youtube" || mediaType === "video" ? videoUrl.trim() : null,
    video_thumbnail:
      mediaType === "youtube" || mediaType === "video"
        ? videoThumbnail.trim()
        : null,
    is_breaking: isBreaking,
    is_featured: isFeatured,
    tags: tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    status: nextStatus,
    published_at: nextStatus === "published" ? new Date().toISOString() : null,
  });

  const save = async (nextStatus: Status) => {
    if (!requireTitle()) return;
    const wasPublished = status === "published";
    const payload = buildPayload(nextStatus);
    let articleId = id && id !== "new" ? id : null;

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from("articles")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        articleId = data.id;
      } else if (id) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
        articleId = id;
      }

      toast({
        title:
          nextStatus === "published"
            ? isRTL
              ? "تم النشر"
              : "Published"
            : isRTL
            ? "تم حفظ المسودة"
            : "Draft saved",
      });

      if (nextStatus === "published" && !wasPublished && articleId) {
        try {
          const { data, error } = await supabase.functions.invoke(
            "fcm-send-article",
            { body: { article_id: articleId } }
          );
          if (error) throw error;
          if (data?.sent != null) {
            toast({
              title: isRTL ? "تم إرسال الإشعارات" : "Notifications sent",
              description: isRTL
                ? `تم الإرسال إلى ${data.sent} مشترك`
                : `Sent to ${data.sent} subscribers`,
            });
          }
        } catch (notifErr: any) {
          console.error("FCM notification failed:", notifErr);
        }
      }

      navigate("/admin/articles");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="text-muted-foreground">
        {isRTL ? "جارٍ التحميل..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/articles")}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <BackIcon className="w-4 h-4" />{" "}
        {isRTL ? "العودة للمقالات" : "Back to articles"}
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew
            ? isRTL
              ? "مقال جديد"
              : "New article"
            : isRTL
            ? "تعديل المقال"
            : "Edit article"}
        </h1>
        <Badge variant={statusBadgeVariant[status]}>
          {status === "published" ? t("statusPublished") : t("statusDraft")}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <Label>{isRTL ? "العنوان" : "Title"}</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{isRTL ? "المقتطف" : "Excerpt"}</Label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
        <div>
          <Label>{isRTL ? "المحتوى" : "Content"}</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 min-h-[300px] leading-relaxed"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{isRTL ? "الكاتب" : "Author"}</Label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{isRTL ? "التصنيف" : "Category"}</Label>
            <Select value={categoryKey} onValueChange={setCategoryKey}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Media Type Selection */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mediaType === "image"}
              onChange={() => {
                setMediaType("image");
                setVideoUrl("");
                setVideoThumbnail("");
              }}
            />
            <ImageIcon className="w-4 h-4" /> Image
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mediaType === "youtube"}
              onChange={() => {
                setMediaType("youtube");
                setImageUrl("");
              }}
            />
            <Video className="w-4 h-4" /> YouTube
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mediaType === "video"}
              onChange={() => {
                setMediaType("video");
                setImageUrl("");
              }}
            />
            <Upload className="w-4 h-4" /> Short Video
          </label>
        </div>

        {/* Image Upload */}
        {mediaType === "image" && (
          <div>
            <Label>{isRTL ? "صورة المقال" : "Article image"}</Label>
            <div className="mt-1 space-y-2">
              {imageUrl ? (
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-border group">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 w-full px-4">
                      <Loader2 className="animate-spin w-6 h-6" />
                      <div className="w-full max-w-xs">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all"
                            style={{ width: `${imageProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block text-center">
                          {imageProgress}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2" />
                      <span>{isRTL ? "اضغط لرفع صورة" : "Upload image"}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}

              <details>
                <summary>{isRTL ? "أو استخدم رابطاً" : "Or use URL"}</summary>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </details>
            </div>
          </div>
        )}

        {/* YouTube */}
        {mediaType === "youtube" && (
          <div>
            <Label>{isRTL ? "رابط يوتيوب" : "YouTube URL"}</Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1"
            />
            {videoThumbnail && (
              <div className="mt-2 relative w-full max-w-md rounded-lg overflow-hidden border border-border">
                <img
                  src={videoThumbnail}
                  alt="YouTube thumbnail"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Short Video Upload */}
        {mediaType === "video" && (
          <div className="space-y-4">
            <div>
              <Label>{isRTL ? "فيديو (أقل من 60 ثانية)" : "Video (under 60 sec)"}</Label>
              <div className="mt-1">
                {videoUrl ? (
                  <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-border group">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoUrl("")}
                      className="absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40">
                    {uploadingVideo ? (
                      <div className="flex flex-col items-center gap-2 w-full px-4">
                        <Loader2 className="animate-spin w-6 h-6" />
                        <div className="w-full max-w-xs">
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full transition-all"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block text-center">
                            {videoProgress}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Video className="w-6 h-6 mb-2" />
                        <span>{isRTL ? "اضغط لرفع فيديو" : "Upload video"}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          MP4, MOV, WebM · max 50MB
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      disabled={uploadingVideo}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleVideoUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}

                <details>
                  <summary>{isRTL ? "أو استخدم رابطاً" : "Or use URL"}</summary>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </details>
              </div>
            </div>

            <div>
              <Label>{isRTL ? "صورة مصغرة للفيديو" : "Video thumbnail"}</Label>
              <div className="mt-1">
                {videoThumbnail ? (
                  <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-border group">
                    <img
                      src={videoThumbnail}
                      alt="thumbnail"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoThumbnail("")}
                      className="absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40">
                    {uploadingThumbnail || autoGeneratingThumbnail ? (
                      <div className="flex flex-col items-center gap-2 w-full px-4">
                        <Loader2 className="animate-spin w-5 h-5" />
                        <div className="w-full max-w-xs">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{
                                width: `${autoGeneratingThumbnail ? 100 : thumbnailProgress}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block text-center">
                            {autoGeneratingThumbnail
                              ? isRTL
                                ? "جارٍ إنشاء الصورة المصغرة..."
                                : "Generating thumbnail..."
                              : `${thumbnailProgress}%`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 mb-1" />
                        <span className="text-sm">
                          {isRTL ? "رفع صورة مصغرة" : "Upload thumbnail"}
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingThumbnail || autoGeneratingThumbnail}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleThumbnailUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}

                <details>
                  <summary>{isRTL ? "أو استخدم رابطاً" : "Or use URL"}</summary>
                  <Input
                    value={videoThumbnail}
                    onChange={(e) => setVideoThumbnail(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </details>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label>
            {isRTL ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma separated)"}
          </Label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
            <Label>{isRTL ? "خبر عاجل" : "Breaking"}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label>{isRTL ? "مقال مميّز" : "Featured"}</Label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ClipboardCheck className="w-4 h-4" /> {isRTL ? "النشر" : "Publish"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => save("draft")}>
              {isRTL ? "حفظ كمسودة" : "Save as draft"}
            </Button>
            {isPublisher && (
              <Button onClick={() => save("published")} className="gap-1">
                <CheckCircle2 className="w-4 h-4" />{" "}
                {isRTL ? "نشر الآن" : "Publish now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}