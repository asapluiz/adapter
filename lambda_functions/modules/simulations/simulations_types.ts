
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
export type SimulationExecutionDbData = {
    sk: string;
    scenario_data:ScenarioData; 
    record_signals: string[];
    pk: string;
    name: string;
    created_by: string 
}

export type ScenarioData = {
    id:string;
    content:string;
    name: string;
    description:string;
}




