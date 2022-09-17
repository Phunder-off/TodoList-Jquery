const API_LINK = "http://localhost:3000/tasks/";

const updateFail = (outputMessage, reloadTask) => {
	outputMessage.text("Echec de la mise a jour des donnée");
	setTimeout(reloadTask, 2000);
};

const loadingMessage = (outputMessage) => {
	outputMessage.html('<div><span class="loader"></span><p>Chargement...</p></div>');
};

const request = {
	getAll: (outputMessage, outputData, reloadTask) => {
		$.ajax({
			type: "GET",
			url: API_LINK,
			beforeSend: () => loadingMessage(outputMessage),
		})
			.done((res) => {
				outputData(res);
				outputMessage.text("");
			})
			.fail(() => updateFail(outputMessage, reloadTask));
	},
	addTask: (outputMessage, data, reloadTask) => {
		data.date = Date.now();
		data.finish = "false";

		$.ajax({
			type: "POST",
			url: API_LINK,
			dataType: "json",
			data: data,
			beforeSend: () => loadingMessage(outputMessage),
		})
			.done(reloadTask)
			.fail(() => outputMessage.text("Echec de la création"));
	},
	deleteTask: (outputMessage, id, reloadTask) => {
		id.each((_, taskId) => {
			$.ajax({
				type: "DELETE",
				url: `${API_LINK}${taskId}`,
				beforeSend: () => loadingMessage(outputMessage),
			})
				.done(reloadTask)
				.fail(() => outputMessage.text("Echec de la supression de la tache"));
		});
	},
	updateTask: (outputMessage, id, data, reloadTask) => {
		$.ajax({
			type: "PATCH",
			url: `${API_LINK}${id}`,
			dataType: "json",
			data: data,
			beforeSend: () => loadingMessage(outputMessage),
		})
			.done(reloadTask)
			.fail(() => updateFail(outputMessage, reloadTask));
	},
	finishTask: async (outputMessage, id, reloadTask) => {
		loadingMessage(outputMessage);

		let task = null;

		await $.ajax({
			type: "GET",
			url: `${API_LINK}${id}`,
			dataType: "json",
		})
			.done((res) => (task = res))
			.fail(() => updateFail(outputMessage, reloadTask));

		if (task) {
			$.ajax({
				type: "PATCH",
				url: `${API_LINK}${id}`,
				dataType: "json",
				data: { finish: !(task.finish === "true") },
			})
				.done(reloadTask)
				.fail(() => updateFail(outputMessage, reloadTask));
		}
		
	},
};
