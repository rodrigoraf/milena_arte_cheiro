import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";

// Hook para lidar com roteamento SPA no GitHub Pages
function useGHPagesRouter() {
  const [location, setLocation] = useLocation();

  // Se estamos no GitHub Pages e há uma query string com a rota
  if (typeof window !== 'undefined' && window.location.search.startsWith('/?')) {
    const path = window.location.search.slice(1); // Remove o '?'
    // Limpar a URL removendo a query string
    window.history.replaceState(null, '', path.split('&')[0].replace('~and~', '&'));
    return [path.split('&')[0].replace('~and~', '&'), setLocation] as const;
  }

  return [location, setLocation] as const;
}

function Router() {
  const [location] = useGHPagesRouter();

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
