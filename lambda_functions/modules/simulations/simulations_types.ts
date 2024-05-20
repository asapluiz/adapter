
export type ValidationResult = {
    valid: boolean;
    errors?: string[];
}

export type simulationsData = {
    sutId:string;
    createdBy:string;
    simulationName:string;
    scenarioData:ScenarioData[];
    recordSignals: string[];
}

export type ScenarioData = {
    id:string;
    content:string;
    name: string;
    description:string;
}




