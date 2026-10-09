import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiCheck, FiFlag, FiPlus, FiTarget, FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";
const key = "goal-planner-goals";
const seed = [{ id: "g1", title: "Read 18 books", area: "Learning", due: "2026-12-31", progress: 56, milestones: ["Choose the next book", "Read for 20 minutes", "Write a short note"], done: [true, true, false] }, { id: "g2", title: "Build a steady morning", area: "Wellbeing", due: "2026-11-15", progress: 32, milestones: ["Wake at a consistent time", "Make space for a walk"], done: [true, false] }, { id: "g3", title: "Save for a small trip", area: "Personal", due: "2027-02-01", progress: 71, milestones: ["Set a monthly amount", "Book the first stay"], done: [true, false] }];
const load = () => { try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data : seed; } catch { return seed; } };
const GoalPlanner = () => {
    const [goals, setGoals] = useState(load);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", area: "Personal", due: "" });
    const [removing, setRemoving] = useState(null);
    const cancelRef = useRef(null);
    useEffect(() => localStorage.setItem(key, JSON.stringify(goals)), [goals]);
    useEffect(() => {
        if (!removing) return undefined;
        cancelRef.current?.focus();
        const onKey = (event) => { if (event.key === "Escape") setRemoving(null); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [removing]);
    const addGoal = (event) => { event.preventDefault(); if (!form.title.trim()) return; setGoals((items) => [...items, { ...form, id: crypto.randomUUID(), progress: 0, milestones: ["Choose the next small step"], done: [false] }]); setForm({ title: "", area: "Personal", due: "" }); setShowForm(false); };
    const update = (id, updater) => setGoals((items) => items.map((goal) => goal.id === id ? updater(goal) : goal));
    const completed = goals.filter((goal) => goal.progress === 100).length;
    const average = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0;
    return <section className={styles.goalPage} id="goals">
        <div className={styles.hero}><div><p className={styles.label}>Progress grows from small steps</p><h1>Keep your goals in reach.</h1><p>Turn an intention into a clear next action.</p></div><button className={styles.addButton} onClick={() => setShowForm(!showForm)}><FiPlus />{showForm ? "Close" : "New goal"}</button></div>
        <div className={styles.summary} id="review"><div><FiTarget /><span><small>Active goals</small><strong>{goals.length}</strong></span></div><div><FiCheck /><span><small>Completed</small><strong>{completed}</strong></span></div><div className={styles.avg}><span>Overall progress</span><strong>{average}%</strong><div><i style={{ width: average + "%" }} /></div></div><p>Review your next step before the week gets busy.</p></div>
        {showForm && <form className={styles.newGoal} onSubmit={addGoal}><label>Goal<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What would you like to make happen?" /></label><label>Area<select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}><option>Personal</option><option>Work</option><option>Learning</option><option>Wellbeing</option><option>Money</option></select></label><label>Target date<input type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} /></label><button type="submit"><FiPlus /> Create goal</button></form>}
        <div className={styles.goalGrid}>{goals.map((goal, index) => <article className={styles.goalCard} key={goal.id}>
            <div className={styles.cardTop}><span className={[styles.area, styles["area" + (index % 3)]].join(" ")}>{goal.area}</span><button onClick={() => setRemoving(goal)} aria-label={"Delete goal " + goal.title}><FiTrash2 /></button></div>
            <h2>{goal.title}</h2><div className={styles.due}><FiCalendar />{goal.due ? "By " + new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(goal.due + "T12:00:00")) : "No target date"}</div>
            <div className={styles.progressLabel}><span>Progress</span><strong>{goal.progress}%</strong></div><input className={styles.range} type="range" min="0" max="100" step="1" value={goal.progress} aria-label={"Goal progress for " + goal.title} onChange={(event) => update(goal.id, (item) => ({ ...item, progress: Number(event.target.value) }))} /><div className={styles.bar}><i style={{ width: goal.progress + "%" }} /></div>
            <div className={styles.stepsTitle}><strong>Small steps</strong><small>{goal.done.filter(Boolean).length}/{goal.done.length}</small></div>
            <ul>{goal.milestones.map((step, stepIndex) => <li key={stepIndex}><label><input type="checkbox" checked={goal.done[stepIndex]} onChange={() => update(goal.id, (item) => ({ ...item, done: item.done.map((done, i) => i === stepIndex ? !done : done) }))} /><span>{step}</span></label></li>)}</ul>
            <form className={styles.addStep} onSubmit={(event) => { event.preventDefault(); const value = event.currentTarget.elements.step.value.trim(); if (!value) return; update(goal.id, (item) => ({ ...item, milestones: [...item.milestones, value], done: [...item.done, false] })); event.currentTarget.reset(); }}><input name="step" aria-label={"Add a small step for " + goal.title} placeholder="Add a small step" /><button aria-label="Add step"><FiPlus /></button></form>
        </article>)}</div>
        {!goals.length && <p className={styles.empty}>No goals here yet. Add one when you are ready.</p>}
        {removing && <div className={styles.modal}><section role="dialog" aria-modal="true" aria-labelledby="delete-heading" aria-describedby="delete-copy"><FiFlag /><h2 id="delete-heading">Remove this goal?</h2><p id="delete-copy"><strong>{removing.title}</strong> and its milestones will be deleted.</p><div><button ref={cancelRef} onClick={() => setRemoving(null)}>Keep goal</button><button onClick={() => { setGoals((items) => items.filter((goal) => goal.id !== removing.id)); setRemoving(null); }}>Remove goal</button></div></section></div>}
        <div className={styles.tip}><FiArrowUpRight /><span><strong>Make the next step smaller.</strong> A clear action is easier to return to than a perfect plan.</span></div>
    </section>;
};
export default GoalPlanner;
