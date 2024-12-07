import React, { useState } from "react";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const createUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include"
      });
      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error("Kullanıcı oluşturma hatası:", error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, password }),
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Giriş yapma hatası:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", { method: "POST" , credentials: "include"});
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(false);
        alert(data.message || "Çıkış yapıldı!");
      }
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
    }
  };

  const updateBalance = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/update_balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({transaction_amount: parseFloat(transactionAmount) }),
        credentials: "include"
      });
      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error("Bakiye güncelleme hatası:", error);
    }
  };

  const getBalance = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_balance", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Bakiyeniz: ${data.decrypted_balance}`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="form-container">
          <div className="card">
            <h2>Kayıt Ol</h2>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={createUser}>Kayıt Ol</button>
          </div>

          <div className="card">
            <h2>Giriş Yap</h2>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Giriş Yap</button>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <button onClick={logout}>Çıkış Yap</button>
          <div className="card">
            <h2>Bakiye Güncelle</h2>
            <input
              type="number"
              placeholder="Miktar"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <button onClick={updateBalance}>Güncelle</button>
          </div>
          <div className="card">
            <h2>Bakiye Getir</h2>
            <button onClick={getBalance}>Bakiyeyi Göster</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
