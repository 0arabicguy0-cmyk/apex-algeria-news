import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import ArticlePage from "./pages/ArticlePage";
import ContactPage from "./pages/ContactPage";
import SearchPage from "./pages/SearchPage";
import TopicPage from "./pages/TopicPage";
import BookmarksPage from "./pages/BookmarksPage";
import NotFound from "./pages/NotFound";
import AuthorPage from "./pages/AuthorPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminArticles from "./pages/AdminArticles";
import AdminArticleEditor from "./pages/AdminArticleEditor";
import AdminFeedback from "./pages/AdminFeedback";
import AdminBreakingNews from "./pages/AdminBreakingNews";
import AdminComments from "./pages/AdminComments";
import AdminNewsletter from "./pages/AdminNewsletter";
import SplashScreen from "./components/SplashScreen";
import CommandPalette from "./components/CommandPalette";
import BackToTop from "./components/BackToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SplashScreen />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CommandPalette />
        <BackToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/topic/:key" element={<TopicPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/author/:slug" element={<AuthorPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/:id" element={<AdminArticleEditor />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="breaking" element={<AdminBreakingNews />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
