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
import AdminPushNotifications from "./pages/AdminPushNotifications";
import AdminCorrections from "./pages/AdminCorrections";
import CorrectionsLogPage from "./pages/CorrectionsLogPage";
import AboutPage from "./pages/AboutPage";
import ImprintPage from "./pages/ImprintPage";
import EditorialPolicyPage from "./pages/EditorialPolicyPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import TermsPage from "./pages/TermsPage";
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
        <a href="#main-content" className="skip-link">Skip to content / تخطّى إلى المحتوى</a>
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          <Route path="/corrections" element={<CorrectionsPage />} />
          <Route path="/corrections-log" element={<CorrectionsLogPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/:id" element={<AdminArticleEditor />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="breaking" element={<AdminBreakingNews />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="push" element={<AdminPushNotifications />} />
            <Route path="corrections" element={<AdminCorrections />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
