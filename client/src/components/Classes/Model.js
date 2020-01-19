/**
 *
 */


import Attribute from "./Attribute";
import Connection from "./Connection";
import ConnectionEnd from "./ConnectionEnd";
import Entity from "./Entity";
import Level from "./Level";
import Method from "./Method";
import Inheritance from "./Inheritance";
import Subtype from "./Subtype";
import Supertype from "./Supertype";

/**
 * Written by Jorge Villalobos
 */
class Model {

	
	constructor(name,owner,graph) {
		this.name=name;
		this.owners=owner;
		this.graph=graph;
		this.levels=[];
		this.levelIndex=0;
		this.timeMachine=[];
		this.indexTM=0;
		this.kind="model";




	}

	works(){
		alert("WORKS");
	}
	getObjectById(id){
		if (this.getLevel(id)!=null){return this.getLevel(id);}
		if (this.getEntityById(id)!=null){return this.getEntityById(id);}
		if (this.getAttributeById(id)!=null){return this.getAttributeById(id);}
		if (this.getMethodById(id)!=null){return this.getMethodById(id);}
		if (this.getConnectionById(id)!=null){return this.getConnectionById(id);}
		if (this.getInheritanceById(id)!=null){return this.getInheritanceById(id);}
		if (this.getSupertypesById(id)!=null){return this.getSupertypesById(id);}
		if (this.getSubtypesById(id)!=null){return this.getSubtypesById(id);}

	}


	addLevel(level,where) {
		if(where!=null){

			var newLength=this.levels.splice(where, 0, level);

		}else{

			var newLength=this.levels.push(level);
		}

	}

	showLevels(){

	}

	createLevels(){
		var i;

		for (i=0;i<this.levels.length;i++){

			this.levels[i].createLevel(this.graph,this.levelIndex);
			this.levelIndex++;
		}

	}

	getLevelById(id){
		var i;
		for (i=0;i<this.levels.length;i++){
			if (this.levels[i].v1.getId()==id){
				return i;
			}
		}

	}

	getLevel(id){
		var i;
		for (i=0;i<this.levels.length;i++){
			if (this.levels[i].id==id){
				return this.levels[i];
			}
		}

	}

	getEntityById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				if (this.levels[i].entities[j].id==id){
					return this.levels[i].entities[j];
				}
			}
		}
	}

	getAttributeById(id){

		var i,j,k;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].attributes.length;k++){

					if (this.levels[i].entities[j].attributes[k].id==id){
						return this.levels[i].entities[j].attributes[k];
					}
				}
			}
		}
	}

	getMethodById(id){

		var i,j,k;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].methods.length;k++){

					if (this.levels[i].entities[j].methods[k].id==id){
						return this.levels[i].entities[j].methods[k];
					}
				}
			}
		}
	}

	getConnectionById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connections.length;j++){
				if (this.levels[i].connections[j].id==id){
					return this.levels[i].connections[j];
				}
			}
		}
	}

	getInheritanceById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].inheritances.length;j++){
				if (this.levels[i].inheritances[j].id==id){
					return this.levels[i].inheritances[j];
				}
			}
		}
	}



	getConnectionEndById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connectionEnds.length;j++){
				if (this.levels[i].connectionEnds[j].id==id){
					return this.levels[i].connectionEnds[j];
				}
			}
		}
	}


	disconnect(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connectionEnds.length;j++){
				if ((this.levels[i].connectionEnds[j].entity.id==id)||(this.levels[i].connectionEnds[j].connection.id==id)){
					this.levels[i].connectionEnds.splice(j,1);
				}
			}
		}

		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].supertypes.length;j++){
				if ((this.levels[i].supertypes[j].entity.id==id)||(this.levels[i].supertypes[j].inheritance.id==id)){
					this.levels[i].supertypes.splice(j,1);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].subtypes.length;j++){
				if ((this.levels[i].subtypes[j].entity.id==id)||(this.levels[i].subtypes[j].inheritance.id==id)){
					this.levels[i].subtypes.splice(j,1);
				}
			}
		}



	}

	getSupertypesById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].supertypes.length;j++){
				if (this.levels[i].supertypes[j].id==id){
					return this.levels[i].supertypes[j];
				}
			}
		}
	}

	getSubtypesById(id){

		var i,j;
		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].subtypes.length;j++){
				if (this.levels[i].subtypes[j].id==id){
					return this.levels[i].subtypes[j];
				}
			}
		}
	}





	remove(id){


		var i,j,k;


		var r = true;
		if (r == true) {



		for (i=0;i<this.levels.length;i++){
			if (this.levels[i].id==id){
				this.levels.splice(i, 1);
			}
		}






		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				if (this.levels[i].entities[j].id==id){

					var ent=this.levels[i].entities[j]
					if (ent.levelNo<(this.levels.length-1)){
						var k;
						for(k=0;k<this.levels[ent.levelNo+1].entities.length;k++){
							if (this.levels[ent.levelNo+1].entities[k].directType==this.levels[i].entities[j].name){
								this.levels[ent.levelNo+1].entities[k].directType="";
							}
						}
					}
					this.levels[i].entities.splice(j,1);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].attributes.length;k++){

					if (this.levels[i].entities[j].attributes[k].id==id){
						this.levels[i].entities[j].attributes.splice(k,1);
					}
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].methods.length;k++){

					if (this.levels[i].entities[j].methods[k].id==id){
						this.levels[i].entities[j].methods.splice(k,1);
					}
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connections.length;j++){
				if (this.levels[i].connections[j].id==id){
					this.levels[i].connections.splice(j,1);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].inheritances.length;j++){
				if (this.levels[i].inheritances[j].id==id){
					this.levels[i].inheritances.splice(j,1);
				}
			}
		}







		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connectionEnds.length;j++){
				if (this.levels[i].connectionEnds[j].id==id){
					this.levels[i].connectionEnds.splice(j,1);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].supertypes.length;j++){
				if (this.levels[i].supertypes[j].id==id){
					this.levels[i].supertypes.splice(j,1);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].subtypes.length;j++){
				if (this.levels[i].subtypes[j].id==id){
					this.levels[i].subtypes.splice(j,1);
				}
			}
		}



		this.disconnect(id);

	}

	}


	updatePosition(){

		//var jn=this.timeMachine.length-this.indexTM;
		//this.timeMachine.splice(this.indexTM+1,this.timeMachine.length-1);
		this.timeMachine.push(this.toJSON());

		var i,j,k,l,m;
		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].entities.length;k++){

				this.levels[i].entities[k].x=this.levels[i].entities[k].vertex.geometry.x;
				this.levels[i].entities[k].y=this.levels[i].entities[k].vertex.geometry.y;
				this.levels[i].entities[k].h=this.levels[i].entities[k].vertex.geometry.height;
				this.levels[i].entities[k].w=this.levels[i].entities[k].vertex.geometry.width;

			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].connections.length;k++){

				this.levels[i].connections[k].x=this.levels[i].connections[k].vertex.geometry.x;
				this.levels[i].connections[k].y=this.levels[i].connections[k].vertex.geometry.y;
				if (this.levels[i].connections[k].vertex.collapsed==false)
				{
					this.levels[i].connections[k].h=this.levels[i].connections[k].vertex.geometry.height;
					this.levels[i].connections[k].w=this.levels[i].connections[k].vertex.geometry.width;
				}
			}
		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].inheritances.length;k++){

				this.levels[i].inheritances[k].x=this.levels[i].inheritances[k].vertex.geometry.x;
				this.levels[i].inheritances[k].y=this.levels[i].inheritances[k].vertex.geometry.y;
				this.levels[i].inheritances[k].h=this.levels[i].inheritances[k].vertex.geometry.height;
				this.levels[i].inheritances[k].w=this.levels[i].inheritances[k].vertex.geometry.width;

			}
		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].connectionEnds.length;k++){

				if (this.levels[i].connectionEnds[k].edge.geometry.points!=null){

					this.levels[i].connectionEnds[k].x=this.levels[i].connectionEnds[k].edge.geometry.points[0].x;
					this.levels[i].connectionEnds[k].y=this.levels[i].connectionEnds[k].edge.geometry.points[0].y;

				}

			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].supertypes.length;k++){

				if (this.levels[i].supertypes[k].edge.geometry.points!=null){
					this.levels[i].supertypes[k].x=this.levels[i].supertypes[k].edge.geometry.points[0].x;
					this.levels[i].supertypes[k].y=this.levels[i].supertypes[k].edge.geometry.points[0].y;
				}
			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].subtypes.length;k++){
				if (this.levels[i].subtypes[k].edge.geometry.points!=null){
					this.levels[i].subtypes[k].x=this.levels[i].subtypes[k].edge.geometry.points[0].x;
					this.levels[i].subtypes[k].y=this.levels[i].subtypes[k].edge.geometry.points[0].y;
				}

			}


		}
		var jsonparse=JSON.parse(this.toJSON());
		var jsonstrigified=JSON.stringify(jsonparse, null, " ");
		if(document.getElementById("jsondisplay")!=null){
			document.getElementById("jsondisplay").value=(""+jsonstrigified);
		}

	}


	build(){

		this.graph.getModel().clear();
		//this.graph.removeCells(this.graph.getChildCells(c, true, true))
		this.levelIndex=0;
		var i,j,k,l,m;
		var parent = this.graph.getDefaultParent();

		var container = this.graph.insertVertex(parent, null, this.name, 300, 50, 1500, 500,'connection');

		for (i=0;i<this.levels.length;i++){

			container.geometry.height=(((i+1)*450)+40);
			this.levels[i].createLevel(this.graph,this.levelIndex,container);
			this.levelIndex++;
		}


		// this.levels[0].entities[1].createEntity(this.graph,this.levels[0].v1);
		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].entities.length;k++){

				this.levels[i].entities[k].createEntity(this.graph,this.levels[i].v1);
				this.levels[i].entities[k].levelNo=i;
			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].entities.length;k++){

				if ((this.levels[i].entities[k].attributes.length>0)||(this.levels[i].entities[k].methods.length>0)){
					this.levels[i].entities[k].createFeatures(this.graph);

				}
			}


		}
		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].connections.length;k++){

				this.levels[i].connections[k].createConnection(this.graph,this.levels[i].v1);
				//this.levels[i].connections[k].vertex.collapsed = true;
			}
		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].connections.length;k++){

				if ((this.levels[i].connections[k].attributes.length>0)||(this.levels[i].connections[k].methods.length>0)){
					this.levels[i].connections[k].createFeatures(this.graph);

				}
			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].connectionEnds.length;k++){

				this.levels[i].connectionEnds[k].connect(this.graph,this.levels[i].v1);

			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].inheritances.length;k++){

				this.levels[i].inheritances[k].createInheritance(this.graph,this.levels[i].v1);

			}
		}


		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].supertypes.length;k++){

				this.levels[i].supertypes[k].connect(this.graph,this.levels[i].v1);

			}


		}

		for (i=0;i<this.levels.length;i++){
			for (k=0;k<this.levels[i].subtypes.length;k++){

				this.levels[i].subtypes[k].connect(this.graph,this.levels[i].v1);

			}


		}

		var jsonparse=JSON.parse(this.toJSON());
		var jsonstrigified=JSON.stringify(jsonparse, null, " ");
		if(document.getElementById("jsondisplay")!=null){
			document.getElementById("jsondisplay").value=(""+jsonstrigified);
		}
		this.graph.foldCells();
	}




	toJSON(){

		var mjson = null;
		var model_json = new Array();
		var i,j,k;
		mjson='[{"name":"'+this.name+'","lockedByUser": 0,"levels":[';
		for (i=0;i<this.levels.length;i++){
			mjson += '{"name":"'+this.levels[i].name+'","levelIndex":'+i+',"entities":[';
			model_json.push(mjson);
			for (j=0;j<this.levels[i].entities.length;j++){
				mjson += '{"name":"'+this.levels[i].entities[j].name+'","secondaryIdEntity":"'+this.levels[i].entities[j].secondaryIdEntity+'","x":'+this.levels[i].entities[j].x+',"y":'+this.levels[i].entities[j].y+',"w":'+this.levels[i].entities[j].w+',"h":'+this.levels[i].entities[j].h+',"potency":'+this.levels[i].entities[j].potency+',"directtype":"'+this.levels[i].entities[j].directType+'","style":"'+this.levels[i].entities[j].styleText+'","attributes":[';

				model_json.push(mjson);

				for (k=0;k<this.levels[i].entities[j].attributes.length;k++){

					mjson += '{"name":"'+this.levels[i].entities[j].attributes[k].name+'","type":"'+this.levels[i].entities[j].attributes[k].type+'","value":"'+this.levels[i].entities[j].attributes[k].value+'","durability":'+this.levels[i].entities[j].attributes[k].durability+',"mutability":'+this.levels[i].entities[j].attributes[k].mutability+'}';
					if (k<this.levels[i].entities[j].attributes.length-1){
						mjson+=",";
					}
					model_json.push(mjson);

				}
				mjson +='],"methods":['
				for (k=0;k<this.levels[i].entities[j].methods.length;k++){

					mjson += '{"name":"'+this.levels[i].entities[j].methods[k].name+'","signature":"'+this.levels[i].entities[j].methods[k].signature+'","body":"'+this.levels[i].entities[j].methods[k].body+'","durability":'+this.levels[i].entities[j].methods[k].durability+'}';
					if (k<this.levels[i].entities[j].methods.length-1){
						mjson+=",";
					}
					model_json.push(mjson);
				}
				mjson +=']}';
				if (j<this.levels[i].entities.length-1){
					mjson+=",";
				}

			}
			mjson +='],"connections":[';
			for (j=0;j<this.levels[i].connections.length;j++){
				mjson +=  '{"name":"'+this.levels[i].connections[j].name+'","secondaryIdConnection":"'+this.levels[i].connections[j].secondaryIdConnection+'","label":"'+this.levels[i].connections[j].label+'","x":'+this.levels[i].connections[j].x+',"y":'+this.levels[i].connections[j].y+',"w":'+this.levels[i].connections[j].w+',"h":'+this.levels[i].connections[j].h+',"potency":'+this.levels[i].connections[j].potency+',"directtype":"'+this.levels[i].connections[j].directType+'","style":"'+this.levels[i].connections[j].styleText+'"}';

				if (j<this.levels[i].connections.length-1){
					mjson+=",";
				}

				model_json.push(mjson);
			}
			mjson +='],"inheritances":[';
			for (j=0;j<this.levels[i].inheritances.length;j++){
				mjson += '{"name":"'+this.levels[i].inheritances[j].name+'","secondaryIdInheritance":"'+this.levels[i].inheritances[j].secondaryIdInheritance+'","complete":'+this.levels[i].inheritances[j].complete+',"disjoint":'+this.levels[i].inheritances[j].disjoint+',"x":'+this.levels[i].inheritances[j].x+',"y":'+this.levels[i].inheritances[j].y+',"w":'+this.levels[i].inheritances[j].w+',"h":'+this.levels[i].inheritances[j].h+'}';
				if (j<this.levels[i].inheritances.length-1){
					mjson+=",";
				}
				model_json.push(mjson);
			}
			mjson +='],"connectionEnds":[';
			for (j=0;j<this.levels[i].connectionEnds.length;j++){

				var a,b,id,ent,conn;
				id=this.levels[i].connectionEnds[j].entity.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].entities.length;b++){
						if (this.levels[a].entities[b].id==id){
							ent=this.levels[a].entities[b].secondaryIdEntity;
						}
					}
				}

				id=this.levels[i].connectionEnds[j].connection.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].connections.length;b++){
						if (this.levels[a].connections[b].id==id){
							conn=this.levels[a].connections[b].secondaryIdConnection;
						}
					}
				}

				mjson += '{"secondaryIdEntity":"'+ent+'","secondaryIdConnection":"'+conn+'","secondaryIdConnectionEnd":"'+this.levels[i].connectionEnds[j].secondaryIdConnectionEnd+'","name":"'+this.levels[i].connectionEnds[j].name+'","rolename":"'+this.levels[i].connectionEnds[j].roleName+'","navigablefrom":'+this.levels[i].connectionEnds[j].navigableFrom+',"lower":'+this.levels[i].connectionEnds[j].lower+',"upper":'+this.levels[i].connectionEnds[j].upper+',"x":'+this.levels[i].connectionEnds[j].x+',"y":'+this.levels[i].connectionEnds[j].y+'}';
				if (j<this.levels[i].connectionEnds.length-1){
					mjson+=",";
				}
				model_json.push(mjson);

			}

			mjson +='],"inheritanceParticipants":[';
			for (j=0;j<this.levels[i].subtypes.length;j++){

				var a,b,id,ent,inh;
				id=this.levels[i].subtypes[j].entity.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].entities.length;b++){
						if (this.levels[a].entities[b].id==id){
							ent=this.levels[a].entities[b].secondaryIdEntity;
						}
					}
				}

				id=this.levels[i].subtypes[j].inheritance.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].inheritances.length;b++){
						if (this.levels[a].inheritances[b].id==id){
							inh=this.levels[a].inheritances[b].secondaryIdInheritance;
						}
					}
				}

				mjson += '{"secondaryIdEntity":"'+ent+'","secondaryIdInheritance":"'+inh+'","secondaryIdInheritanceParticipant":"'+this.levels[i].subtypes[j].secondaryIdInheritanceParticipant+'","name":"'+this.levels[i].subtypes[j].name+'","role":"'+this.levels[i].subtypes[j].role+'","x":'+this.levels[i].subtypes[j].x+',"y":'+this.levels[i].subtypes[j].y+'}';

				if (j<this.levels[i].subtypes.length-1){
					mjson+=",";
				}model_json.push(mjson);

			}
			mjson +=']}';
			if (i<this.levels.length-1){
				mjson+=",";
			}

		}mjson +=']}]';


		//document.write(mjson);
		// var result2=JSON.parse(mjson);
		return mjson;
		//var result2=JSON.parse(result);

		// alert(""+ result2[0].name);



	}



	toJSON2(){

		var mjson = null;
		var model_json = new Array();
		var i,j,k;
		for (i=0;i<this.levels.length;i++){
			mjson = {"type":"level","name":this.levels[i].name};
			model_json.push(mjson);
		}






		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				mjson = {"type":"entity","level":i,"name":this.levels[i].entities[j].name,"x":this.levels[i].entities[j].x,"y":this.levels[i].entities[j].y,"w":this.levels[i].entities[j].w,"h":this.levels[i].entities[j].h};

				model_json.push(mjson);
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].attributes.length;k++){

					//alert(""+this.levels[i].entities[j].attributes.length);
					mjson = {"type":"attribute","level":i,"entity":j,"name":this.levels[i].entities[j].attributes[k].name,"atype":this.levels[i].entities[j].attributes[k].type};
					//mjson = {"type":"entity"};
					// alert(""+model_json.length);
					model_json.push(mjson);
					//alert(""+model_json.length);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].entities.length;j++){
				for (k=0;k<this.levels[i].entities[j].methods.length;k++){

					mjson = {"type":"method","level":i,"entity":j,"name":this.levels[i].entities[j].methods[k].name,"atype":this.levels[i].entities[j].methods[k].type};
					model_json.push(mjson);
				}
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connections.length;j++){




				mjson = {"type":"connection","level":i,"name":this.levels[i].connections[j].name,"x":this.levels[i].connections[j].x,"y":this.levels[i].connections[j].y,"w":this.levels[i].connections[j].w,"h":this.levels[i].connections[j].h};
				model_json.push(mjson);
			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].inheritances.length;j++){
				mjson = {"type":"inheritance","level":i,"name":this.levels[i].inheritances[j].name,"x":this.levels[i].inheritances[j].x,"y":this.levels[i].inheritances[j].y,"w":this.levels[i].inheritances[j].w,"h":this.levels[i].inheritances[j].h};
				model_json.push(mjson);
			}
		}







		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].connectionEnds.length;j++){

				var a,b,id,ent,conn;
				id=this.levels[i].connectionEnds[j].entity.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].entities.length;b++){
						if (this.levels[a].entities[b].id==id){
							ent=b;
						}
					}
				}

				id=this.levels[i].connectionEnds[j].connection.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].connections.length;b++){
						if (this.levels[a].connections[b].id==id){
							conn=b;
						}
					}
				}

				mjson = {"type":"connectionEnd","level":i,"entity":ent,"connection":conn,"name":this.levels[i].connectionEnds[j].name,"x":this.levels[i].connectionEnds[j].x,"y":this.levels[i].connectionEnds[j].y};
				model_json.push(mjson);

			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].supertypes.length;j++){

				var a,b,id,ent,inh;
				id=this.levels[i].supertypes[j].entity.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].entities.length;b++){
						if (this.levels[a].entities[b].id==id){
							ent=b;
						}
					}
				}

				id=this.levels[i].supertypes[j].inheritance.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].inheritances.length;b++){
						if (this.levels[a].inheritances[b].id==id){
							inh=b;
						}
					}
				}

				mjson = {"type":"supertype","level":i,"entity":ent,"inheritance":inh,"name":this.levels[i].supertypes[j].name,"x":this.levels[i].supertypes[j].x,"y":this.levels[i].supertypes[j].y};
				model_json.push(mjson);

			}
		}





		for (i=0;i<this.levels.length;i++){
			for (j=0;j<this.levels[i].subtypes.length;j++){

				var a,b,id,ent,inh;
				id=this.levels[i].subtypes[j].entity.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].entities.length;b++){
						if (this.levels[a].entities[b].id==id){
							ent=b;
						}
					}
				}

				id=this.levels[i].subtypes[j].inheritance.id;
				for (a=0;a<this.levels.length;a++){
					for (b=0;b<this.levels[a].inheritances.length;b++){
						if (this.levels[a].inheritances[b].id==id){
							inh=b;
						}
					}
				}

				mjson = {"type":"subtype","level":i,"entity":ent,"inheritance":inh,"name":this.levels[i].subtypes[j].name,"x":this.levels[i].subtypes[j].x,"y":this.levels[i].subtypes[j].y};
				model_json.push(mjson);

			}
		}


		var result=JSON.stringify(model_json);
		return result;
		//var result2=JSON.parse(result);

		// alert(""+ result2[0].name);



	}

	fromJSON(string_model){
		
		var model=JSON.parse(string_model);
		
		var i,j,k;
		this.name=model[0].name;
		//alert(""+model[0].levels.length);
		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels.length;j++) {
				if (model[0].levels[j].levelIndex==i) {
					
					let level1 = new Level(model[0].levels[i].name, this.graph);
					level1.levelno=i;
					this.addLevel(level1);
					break;
				}
			}
		}


		



		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].entities.length;j++){
				if(model[0].levels[i].entities[j].style==null){
					model[0].levels[i].entities[j].style="";
				}
				let entity1 = new Entity(model[0].levels[i].entities[j].name,model[0].levels[i].entities[j].potency,model[0].levels[i].entities[j].directtype,model[0].levels[i].entities[j].style);
				entity1.x=model[0].levels[i].entities[j].x;

				entity1.y=model[0].levels[i].entities[j].y;
				entity1.h=model[0].levels[i].entities[j].h;
				entity1.w=model[0].levels[i].entities[j].w;
				entity1.secondaryIdEntity=model[0].levels[i].entities[j].secondaryIdEntity;

				this.levels[i].addEntity(entity1);
			}
		}



		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].entities.length;j++){
				for (k=0;k<model[0].levels[i].entities[j].attributes.length;k++){

					let att1 = new Attribute(model[0].levels[i].entities[j].attributes[k].name, model[0].levels[i].entities[j].attributes[k].atype, model[0].levels[i].entities[j].attributes[k].value,model[0].levels[i].entities[j].attributes[k].durability,model[0].levels[i].entities[j].attributes[k].mutability);
					this.levels[i].entities[j].addAttribute(att1);
				}
			}
		}





		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].entities.length;j++){
				for (k=0;k<model[0].levels[i].entities[j].methods.length;k++){

					let meth1 = new Method(model[0].levels[i].entities[j].methods[k].name, model[0].levels[i].entities[j].methods[k].signature,model[0].levels[i].entities[j].methods[k].body,model[0].levels[i].entities[j].methods[k].durability);
					this.levels[i].entities[j].addMethod(meth1);
				}
			}
		}





		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].connections.length;j++){
				let conn1 = new Connection(model[0].levels[i].connections[j].name,model[0].levels[i].connections[j].potency,model[0].levels[i].connections[j].directtype,model[0].levels[i].connections[j].label);
				conn1.x=model[0].levels[i].connections[j].x;

				conn1.y=model[0].levels[i].connections[j].y;
				conn1.h=model[0].levels[i].connections[j].h;
				conn1.w=model[0].levels[i].connections[j].w;
				conn1.secondaryIdConnection=model[0].levels[i].connections[j].secondaryIdConnection;

				this.levels[i].addConnection(conn1);
			}
		}





		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].inheritances.length;j++){
				let inh1 = new Inheritance(model[0].levels[i].inheritances[j].name,model[0].levels[i].inheritances[j].complete,model[0].levels[i].inheritances[j].disjoint);
				inh1.x=model[0].levels[i].inheritances[j].x;

				inh1.y=model[0].levels[i].inheritances[j].y;
				inh1.h=model[0].levels[i].inheritances[j].h;
				inh1.w=model[0].levels[i].inheritances[j].w;
				inh1.secondaryIdInheritance=model[0].levels[i].inheritances[j].secondaryIdInheritance;

				this.levels[i].addInheritance(inh1);
			}
		}




		var enty,conn;

		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].connectionEnds.length;j++){
				for (k=0;k<model[0].levels[i].entities.length;k++){
					if(model[0].levels[i].entities[k].secondaryIdEntity==model[0].levels[i].connectionEnds[j].secondaryIdEntity){
						enty=this.levels[i].entities[k];
					}
				}
				for (k=0;k<model[0].levels[i].connections.length;k++){
					if(model[0].levels[i].connections[k].secondaryIdConnection==model[0].levels[i].connectionEnds[j].secondaryIdConnection){
						conn=this.levels[i].connections[k];
					}
				}
				let connEnd1 = new ConnectionEnd(model[0].levels[i].connectionEnds[j].name,enty,conn,model[0].levels[i].connectionEnds[j].rolename,model[0].levels[i].connectionEnds[j].navigablefrom,model[0].levels[i].connectionEnds[j].lower,model[0].levels[i].connectionEnds[j].upper);
				connEnd1.x=model[0].levels[i].connectionEnds[j].x;

				connEnd1.y=model[0].levels[i].connectionEnds[j].y;
				connEnd1.secondaryIdConnectionEnd=model[0].levels[i].connectionEnds[j].secondaryIdConnectionEnd;


				this.levels[i].addConnectionEnd(connEnd1);
			}
		}






		var inh;
		enty=null;



		for (i=0;i<model[0].levels.length;i++){
			for (j=0;j<model[0].levels[i].inheritanceParticipants.length;j++){

			    for (k=0;k<model[0].levels[i].entities.length;k++){
					if(model[0].levels[i].entities[k].secondaryIdEntity==model[0].levels[i].inheritanceParticipants[j].secondaryIdEntity){

					    enty=this.levels[i].entities[k];
					}
				}
				for (k=0;k<model[0].levels[i].inheritances.length;k++){
					if(model[0].levels[i].inheritances[k].secondaryIdInheritance==model[0].levels[i].inheritanceParticipants[j].secondaryIdInheritance){
						
					    inh=this.levels[i].inheritances[k];
					}
				}
				let connEnd1 = new Subtype(model[0].levels[i].inheritanceParticipants[j].name,enty,inh,model[0].levels[i].inheritanceParticipants[j].role);
				connEnd1.x=model[0].levels[i].inheritanceParticipants[j].x;

				connEnd1.y=model[0].levels[i].inheritanceParticipants[j].y;



				this.levels[i].addSubtype(connEnd1);
			}
		}


	}

	fromJSON2(string_model){
		var i;
		//var xmlleft = string_model.replace("},{", "}]},{[{");

		//var split=xmlleft.split("},{")
		var model=JSON.parse(string_model);
		this.levels=[];
		for (i=0;i<model.length;i++){

			//var model=JSON.parse(split[i]);
			var modelo=model[i];
			var type= modelo.type;



			if (type=="level"){
				let level1 = new Level(modelo.name, this.graph);
				this.addLevel(level1);
			}

			if (type=="entity"){

				let entity1 = new Entity(modelo.name,0,'','shape=image;image=http://clipart-library.com/images/76TrKyGiK.png');
				entity1.x=modelo.x;

				entity1.y=modelo.y;
				entity1.h=modelo.h;
				entity1.w=modelo.w;


				this.levels[modelo.level].addEntity(entity1);

			}

			if (type=="connection"){

				let conn1 = new Connection(modelo.name);
				conn1.x=modelo.x;

				conn1.y=modelo.y;
				conn1.h=modelo.h;
				conn1.w=modelo.w;


				this.levels[modelo.level].addConnection(conn1);

			}

			if (type=="inheritance"){

				let inh1 = new Inheritance(modelo.name);
				inh1.x=modelo.x;

				inh1.y=modelo.y;
				inh1.h=modelo.h;
				inh1.w=modelo.w;


				this.levels[modelo.level].addInheritance(inh1);

			}

			if (type=="connectionEnd"){



				let connEnd1 = new ConnectionEnd(modelo.name,this.levels[modelo.level].entities[modelo.entity],this.levels[modelo.level].connections[modelo.connection]);
				connEnd1.x=modelo.x;

				connEnd1.y=modelo.y;



				this.levels[modelo.level].addConnectionEnd(connEnd1);

			}



			if (type=="supertype"){



				let connEnd1 = new Supertype(modelo.name,this.levels[modelo.level].entities[modelo.entity],this.levels[modelo.level].inheritances[modelo.inheritance]);
				connEnd1.x=modelo.x;

				connEnd1.y=modelo.y;



				this.levels[modelo.level].addSupertype(connEnd1);

			}


			if (type=="subtype"){



				let connEnd1 = new Subtype(modelo.name,this.levels[modelo.level].entities[modelo.entity],this.levels[modelo.level].inheritances[modelo.inheritance]);
				connEnd1.x=modelo.x;

				connEnd1.y=modelo.y;



				this.levels[modelo.level].addSubtype(connEnd1);

			}


			if (type=="attribute"){
				let att1 = new Attribute(modelo.name, modelo.atype);
				this.levels[modelo.level].entities[modelo.entity].addAttribute(att1);
			}

			if (type=="method"){
				let meth1 = new Method(modelo.name, modelo.atype);
				this.levels[modelo.level].entities[modelo.entity].addMethod(meth1);
			}
		}
	}




}


export default Model;
