const fs=require("fs");
const {
	jsonStringify,
	ReadFile,
	GetLineSimple,
	ReadDir,
}=globals.functions;

this.start=()=>{
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
			GetLineSimple(config,item)
		);
		const config1=otherInfos.map(item=>
			GetLineSimple(config,item)
		);
		if(config0.some(item=>item===undefined)){continue;}

		let index;
		for(index in config0){
			project[requiredInfos[index]]=config0[index]
		}
		for(index in config1){
			project[otherInfos[index]]=config1[index]
		}
		project.folderPath=dir;
		project.id=folder;
		project.configFilePath=configFilePath;
		this.projects.push(project);
	}
	log(jsonStringify(this));
}
this.getProjects=()=>{
	return this.projects
}
this.stop=()=>{
	this.watch=false;
}
