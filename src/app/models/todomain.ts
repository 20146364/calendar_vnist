export class Todomain {
    id: any;
    title: any;
    allDay = false;
    color: string;
    className: string;
    description: any;
    typeOfEvent = "Todomain";
    listPlantID: any[];
    creatorID: any;
    modifierID: any;
    deleterID: any;
    listSharedTeamsID: any[];
    listTodosubsID: any[];
    responsible_person_id: any;
    responsible_team_id: any;

    eventTodo: any;
    /**
     *
     */
    constructor() {
    }

    initInfo(td: any) {
        this.color = "#58595a";
        this.eventTodo = td;
        this.id = td.id;
        this.title = td.name;
        this.listPlantID = td.plants;
        this.description = td.description;
        this.creatorID = td.creator_id;
        this.modifierID = td.modifier_id;
        this.deleterID = td.deleter_id;
        this.listSharedTeamsID = td.shared_teams;
        this.listTodosubsID = td.todosubs;
        this.responsible_person_id = td.responsible_person_id;
        this.responsible_team_id = td.responsible_team_id;
    }
    
    getInfo(td: any){
        console.log('todomain:', td);
    }
  }
