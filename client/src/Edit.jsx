
export default function Edit() {
  function handleForm(e) {
    e.preventDefault();
    let oldKey = document.getElementById("oldtname").innerText;
    let tname = e.target[0].value;
    let tdesc = e.target[1].value;
    let duedate = e.target[2].value;
    let prior = e.target[3].value;
    if (tname === null || tname === undefined || tname === "")
      alert("Task Name is Required!");
    else {
      let obj = {
        name: tname,
        description: tdesc,
        duedate: duedate,
        priority: prior == 0 ? "High" : prior == 1 ? "Medium" : "Low",
        completed: 0,
      };
      localStorage.setItem(tname, JSON.stringify(obj));
      alert("Task Updated Successfully");
      localStorage.removeItem(oldKey);
      document.getElementById("authentication-modal").style.display = "none";
      window.location.reload();
    }
  }
  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-gray-50 rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">Edit Task</h3>
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              data-modal-hide="authentication-modal"
              onClick={() => {
                document.getElementById("authentication-modal").style.display =
                  "none";
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
              <p id="oldtname" className="hidden"></p>
          <div className="p-4 md:p-5">
            <form
              className="space-y-4"
              action="#"
              method="post"
              id="edit_form"
              onSubmit={handleForm.bind(this)}
            >
              <div>
                <label
                  htmlFor="tname"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Task Name*
                </label>
                <input
                  type="text"
                  name="tname"
                  id="tname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tdesc"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Task Description
                </label>
                <textarea
                  name="tdesc"
                  id="tdesc"
                  className="text-ellipsis bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                ></textarea>
              </div>
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                name="duedate"
                id="duedate"
                className="ml-20 p-2 cursor-pointer border-2"
              />
              <br />
              <br />
              <label htmlFor="priority">Priority</label>
              <select
                name="priority"
                id="priority"
                className="ml-24 p-2 cursor-pointer border-2"
              >
                <option value="0">High</option>
                <option value="1">Medium</option>
                <option value="2">Low</option>
              </select>
              <br />
              <br />
              <br />
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
