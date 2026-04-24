DROP TRIGGER IF EXISTS trg_increment_article_view_count ON public.article_views;
CREATE TRIGGER trg_increment_article_view_count
  AFTER INSERT ON public.article_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_article_view_count();