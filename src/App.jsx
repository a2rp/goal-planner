import { useEffect, useState } from "react";
import GoalPlanner from "./components/goalPlanner/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";
const App = () => {
 const [showBackToTop, setShowBackToTop] = useState(false);
 useEffect(() => { const update = () => setShowBackToTop(window.scrollY > 50); window.addEventListener("scroll", update, { passive: true }); update(); return () => window.removeEventListener("scroll", update); }, []);
 return <div className={styles.appShell} id="top"><SiteHeader title="Goal Planner" mark="G" repoUrl="https://github.com/a2rp/goal-planner" navItems={[["Goals","#goals"],["Review","#review"]]} /><main className={styles.pageContent}><GoalPlanner /></main><SiteFooter repoUrl="https://github.com/a2rp/goal-planner" /><BackToTop visible={showBackToTop} /></div>;
};
export default App;