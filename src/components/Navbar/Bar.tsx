import styles from "./navbar.module.css";

export default function Bar() {
  return (
    <div className={styles.bar}>
      <label htmlFor="search">
        <img src="/assets/search.png" alt="search" />
      </label>
      <input
        className={styles.bar}
        id="search"
        type="text"
        placeholder="Search"
      />
    </div>
  );
}
