"use client";
import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
// import { useLogout } from "@/hooks/useLogout";
import Modal from "../Modal/Modal";
import LoginForm from "../authForms/LoginForm";
import SignupForm from "../authForms/SignupForm";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import Bar from "./Bar";
import useAuth from "@/hooks/useAuth";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export default function Navbar() {
  const {
    auth: { user },
  } = useAuth();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const [loginForm, setLoginForm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  //   const { signout } = useLogout();

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <img src="/assets/logo3.png" alt="Vortex" />
          <span className={pacifico.className}>Vortex</span>
        </Link>
        <Bar />
        <div>
          {user ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
              alt={user.username}
            />
          ) : (
            <button onClick={() => toggleModal()}>Login</button>
          )}
        </div>
      </nav>
      {showModal && (
        <Modal id={loginForm ? 1 : 0} toggleModal={toggleModal}>
          <h1>{!loginForm ? "Sign Up" : "Log In"}</h1>
          <p>
            By continuing, you are setting up an account and agree to our{" "}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              User Agreement
            </a>{" "}
            and{" "}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Privacy Policy
            </a>
            .
          </p>
          {loginForm ? (
            <LoginForm toggleModal={toggleModal} />
          ) : (
            <SignupForm toggleModal={toggleModal} />
          )}
          <div>
            {loginForm ? "New to Vortex? " : "Already on Vortex? "}
            <button onClick={() => setLoginForm((prev) => !prev)}>
              {loginForm ? "Sign Up" : "Login"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
