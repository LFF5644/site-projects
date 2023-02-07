const fs=require("fs");
const {
	jsonStringify,
	jsonParseTry,
	ReadFile,
	GetLineSimple,
	ReadDir,
}=globals.functions;

this.start=()=>{
	actions.projectsService_readProjects={
		display:"Projekte neu laden",
		service:"projects.service.js",
		servicename:"Projekte untersuchen",
		action: this.projectsChanged,
		enabled:true,
	}
	actions.projectsService_stop={
		display:"Service Stoppen",
		service:"projects.service.js",
		servicename:"Projekte untersuchen",
		action:this.stop,
		enabled:true,
	}
	actions.projectsService_start={
		display:"Service Starten",
		service:"projects.service.js",
		servicename:"Projekte untersuchen",
		action:this.start,
		enabled:false,
	}
	this.watch=true;
	this.projects=[];
	fs.watch("public/p",this.projectsChanged);
	this.projectsChanged();
}
this.projectsChanged=(action,file)=>{
	if(!this.watch){return false;}

	const folders=ReadDir('public/p');
	const requiredInfos=[
		"name",
		"version",
	];
	const otherInfos=[
		"versionTag",
		"versionTagColor",
		"adminsOnly",
		"old",
		"info",
		"git",
	];
	let folder="";
	this.projects=[];
	for(folder of folders){
		const dir="public/p/"+folder;
		const configFilePath=dir+"/config.ini";
		const project={};

		const config=ReadFile(configFilePath);
		if(!config){continue;}

		const config0=requiredInfos.map(item=>
			jsonParseTry(GetLineSimple(config,item))
		);
		const config1=otherInfos.map(item=>
			jsonParseTry(GetLineSimple(config,item))
		);
		if(config0.some(item=>item===undefined)){continue;}

		let index;
		for(index in config0){
			project[requiredInfos[index]]=config0[index];
		}
		for(index in config1){
			project[otherInfos[index]]=config1[index];
		}
		project.folderPath=dir;
		project.id=folder;
		project.configFilePath=configFilePath;
		this.projects.push(project);
	}
}
this.getProjects=()=>{
	return this.projects;
}
this.stop=()=>{
	actions.projectsService_start.enabled=true;
	actions.projectsService_readProjects.enabled=false;
	actions.projectsService_stop.enabled=false;
	this.watch=false;
}
