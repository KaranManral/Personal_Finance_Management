import { jwtDecode } from "jwt-decode";

export default function Head() {
  let token = localStorage.getItem("token");
  if (token) {
    let ob = jwtDecode(token);
    if (ob.loggedIn) {
      return (
        <main className="w-full h-fit bg-sky-600 flex sm:flex-row max-sm:flex-col justify-around align-middle overflow-hidden ">
          <a href="/" id="app_title" className="font-extralight text-slate-50">
            Finance Manager
          </a>
          <div className="btn_container h-fit flex justify-around align-middle self-center">
            <a
              className="normal_head p-5 hover:bg-sky-500 text-slate-50"
              href="/show-transactions"
            >
              Transactions List
            </a>
            <a
              className="normal_head p-5 hover:bg-sky-500 text-slate-50"
              href="/add-transaction"
            >
              Add a new Transaction
            </a>
            <a
              className="normal_head p-5 hover:bg-sky-500 text-slate-50"
              href="/logout"
            >
              Logout
            </a>
          </div>
        </main>
      );
    }
  }
  return (
    <main className="w-full h-fit bg-sky-600 flex sm:flex-row max-sm:flex-col justify-around align-middle overflow-hidden ">
      <a href="/" id="app_title" className="font-extralight text-slate-50">
        Finance Manager
      </a>
      <div className="btn_container h-fit flex justify-around align-middle self-center">
        <a
          className="normal_head p-5 hover:bg-sky-500 text-slate-50"
          href="/login"
        >
          Login
        </a>
        <a
          className="normal_head p-5 hover:bg-sky-500 text-slate-50"
          href="/register"
        >
          Register
        </a>
      </div>
    </main>
  );
}
