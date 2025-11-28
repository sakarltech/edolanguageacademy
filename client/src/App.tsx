import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseBeginner from "./pages/CourseBeginner";
import CourseIntermediary from "./pages/CourseIntermediary";
import CourseProficient from "./pages/CourseProficient";
import Pricing from "./pages/Pricing";
import Schedule from "./pages/Schedule";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import Forum from "./pages/Forum";
import ForumThread from "./pages/ForumThread";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/courses"} component={Courses} />
      <Route path={"/courses/beginner"} component={CourseBeginner} />
      <Route path={"/courses/intermediary"} component={CourseIntermediary} />
      <Route path={"/courses/proficient"} component={CourseProficient} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/schedule"} component={Schedule} />
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/register"} component={Register} />
      <Route path={"/enrollment/success"} component={EnrollmentSuccess} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/announcements"} component={AdminAnnouncements} />
      <Route path={"/forum"} component={Forum} />
      <Route path={"/forum/:id"} component={ForumThread} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

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
