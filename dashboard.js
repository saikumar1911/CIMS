import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDD4PDJ-2dGabACe5Tn1y4L62KRqQY2_2E",
  authDomain: "cims-project-a2ab9.firebaseapp.com",
  projectId: "cims-project-a2ab9",
  storageBucket: "cims-project-a2ab9.firebasestorage.app",
  messagingSenderId: "88316003268",
  appId: "1:88316003268:web:658e5cac8459c8b6785a91",
  measurementId: "G-J36LJTNLX9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "yennisaikumar5@gmail.com";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const welcomeText = document.getElementById("welcomeText");
  const adminBtn = document.getElementById("adminBtn");
  const dashboardLink = document.getElementById("dashboardLink");
  const submitLink = document.getElementById("submitLink");
  const myComplaintsLink = document.getElementById("myComplaintsLink");
  const logoutBtn = document.getElementById("logoutBtn");

  let snapshot;

  // 🔥 ADMIN LOGIC
  if (user.email.toLowerCase() === adminEmail.toLowerCase()) {

    welcomeText.innerText = "Welcome, Admin 👨‍💼";

    // Show Admin Panel
    adminBtn.style.display = "inline-block";
    adminBtn.onclick = () => {
      window.location.href = "admin.html";
    };

    // Hide student links
    dashboardLink.style.display = "none";
    submitLink.style.display = "none";
    myComplaintsLink.style.display = "none";

    // Get ALL complaints
    snapshot = await getDocs(collection(db, "complaints"));

  } 
  // 🎓 STUDENT LOGIC
  else {

    welcomeText.innerText = "Welcome, Student 🎓";

    adminBtn.style.display = "none";

    // Show student links
    dashboardLink.style.display = "inline";
    submitLink.style.display = "inline";
    myComplaintsLink.style.display = "inline";

    // Get only student's complaints
    const q = query(
      collection(db, "complaints"),
      where("userEmail", "==", user.email)
    );

    snapshot = await getDocs(q);
  }

  // 🔢 COUNT LOGIC
  let total = 0;
  let pending = 0;
  let resolved = 0;

  snapshot.forEach((docItem) => {
    total++;

    if (docItem.data().status === "Pending") pending++;
    if (docItem.data().status === "Resolved") resolved++;
  });

  document.getElementById("totalCount").innerText = total;
  document.getElementById("pendingCount").innerText = pending;
  document.getElementById("resolvedCount").innerText = resolved;

  // 🔓 LOGOUT FUNCTION
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "index.html";
  });

});