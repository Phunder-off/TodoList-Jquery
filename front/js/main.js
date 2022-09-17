//fonction
const loadTasks = () => request.getAll($("#state"), renderTaskList, loadTasks);

const renderTaskList = (tasks) => {
	let listTask = "";

	tasks.forEach((task) => {
		const { id, title, description, author, date, finish } = task;

		listTask += `
            <div class="card" data-taskId="${id}">
				<div class="card-header">
					<h3 data-name="title">${title.replaceAll("<", "&lt;")}</h3>
					<h4 data-name="date">${new Date(Date(date)).getDay()}/${new Date(Date(date)).getMonth()}/${new Date(Date(date)).getFullYear()}</h4>
				</div>
				
				<div class="card-body">
					<p data-name="description">${description.replaceAll("<", "&lt;")}</p>
				</div>
				
				<div class="card-footer">
					<span data-name="author">${author.replaceAll("<", "&lt;")}</span> 
					<button id="btn_finish_task" data-finish="${finish}">${finish == "true" ? "Fait" : "A faire"}</button>
				</div>
			</div>
        `;
	});

	$("#listTask").children(".list").html(listTask);

	$("button#btn_finish_task").click(toggleFinishTask);
};

const newTask = (e) => {
	e.preventDefault();

	const [title, description, author] = $(e.currentTarget)
		.find("input")
		.map((_, input) => $(input).val());

	request.addTask($("#state"), { title, description, author }, loadTasks);
};

const deleteTasks = () => {
	request.deleteTask(
		$("#state"),
		$(".card-focus").map((_, card) => $(card).data("taskid")),
		loadTasks
	);
	$(".card-focus").hide().toggleClass("card-focus");
};

const updateTask = (e) => {
	e.preventDefault();

	const id = $(e.currentTarget).data("taskid");
	const [title, description, author] = $(e.currentTarget)
		.find("input")
		.map((_, input) => $(input).val());

	request.updateTask($("#state"), id, { title, description, author }, loadTasks);
};

const filterTask = (e) => {
	e.preventDefault();

	$(".card").show();

	switch ($(e.currentTarget).find("input:checked").val()) {
		case "true":
			$('button[data-finish="false"]').closest(".card").hide();
			break;
		case "false":
			$('button[data-finish="true"]').closest(".card").hide();
			break;
		default:
			break;
	}

	$(e.currentTarget).removeClass("show");
};

const toggleFinishTask = (e) => {
	request.finishTask($("#state"), $(e.target).closest(".card").data("taskid"), loadTasks);
};

const toggleForm = (e) => {
	$(`#${$(e.currentTarget).data("target")}`).toggleClass("show");
};

const updateTaskToggle = () => {
	const taskId = $(".card-focus").data("taskid");

	if (taskId) {
		const [title, description, author] = $(".card-focus")
			.find("[data-name]")
			.map((_, elem) => $(elem).text());

		$("#title_update").val(title);
		$("#description_update").val(description);
		$("#author_update").val(author);
	}
};

// start
$(document).ready(loadTasks);

// action
$("#formNewTask").submit(newTask);
$("#formUpdateTask").submit(updateTask);
$("#formFilterTask").submit(filterTask);

$("button#reloadTasks").click(loadTasks);

$("button#deleteTask").click(deleteTasks);

$("button#updateTask").click(updateTaskToggle);

$("button[data-action='toggleForm']").click(toggleForm);

// selection des card
$(".list").click((e) => $(e.target).closest(".card").toggleClass("card-focus"));
