
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
    scenarioData:ScenarioData[]; 
    recordSignals: string[];
    pk: string;
    name: string;
    createdBy: string,
    id: string; 
}

export type ScenarioData = {
    id:string;
    content:string;
    name: string;
    description:string;
}

export type SimulationScenarioConfiguration = {
    road: string;
    environment: EnvironmentConfiguration;
    oddParameters: OddParameters[];
    parameters: ScenarioParameters[];
}

export type EnvironmentConfiguration = {
    visibility: number;
    brightness: number;
    cloudState: number;
    potholes: number;
    precipitation: number;
    timeOfDay: number;
}

export type OddParameters = {
    name: string;
    value: string;
}

export type ScenarioParameters = {
    name: string;
    id: string
    lower:string;
    upper: string;
    unit: string
}

export type QueueData = {
    simulation_run_id: string,
    simulation_execution_id: string,
    scenario:ScenarioData,
    scenario_parameters: ScenarioParameters[],
    road: string,
    environment_parameters: EnvironmentConfiguration,
    odd_parameters: OddParameters[],
    record_signals: string[],
    sut_id: string,
}

export type SimulationRunResultData = {
    state?:string;
    weaknessScore?:number;
    started?:string;
    finished?:string;
    errorReason?:string;
    extraData?: (DebugUiResultData | VideoResultData)[];
    rtcFailure?: RTCFailure;
    rtcValues?: RtcSimulationRunInterpretation;
    traceUrl?: string;
}

export type SimulationRunDbData  = SimulationRunResultData &{
    id:string;
    road?: string;
    environment?: EnvironmentConfiguration;
    oddParameters?: OddParameters[];
    parameters?: ScenarioParameters[];
    scenarioId?: string;
}

export type DebugUiResultData = {
    type: string;
    debugLink: string;
}

export type VideoResultData = {
    type: string;
    videoUrl: string;
}

export type RTCFailure = {
    timestamp:number;
    reasons: RtcFailureReason[]
}

export type RtcFailureReason = {
    phaseName?:string;
    phaseId?: string;
    reasonType:string;
    textualDescription: string;
}

export type RtcSimulationRunInterpretation = {
    phases: RtcPhaseObservationInterpretation[];
    constraints: RtcConstraintEvaluationMap;
    coverage: boolean;
}

export type RtcPhaseObservationInterpretation = {
    phaseName?:string;
    phaseId?: string;
    startTime: number;
    endTime: number;
    constraints:RtcConstraintEvaluationMap; 
}

export type RtcConstraintEvaluationMap = {
    additionalProperties: RtcConstraintEvaluation;
}

export type RtcConstraintEvaluation = {
    constraintId:string;
    startTime:number;
    endTime:number;
    maximalObservedValue: number;
    minimalObservedValue: number;
    fulfillmentType: string;
}

export type pathSESCids = {
    simulation_execution_id: string;
    scenario_id:string
}

export type PathSERids = {
    simulation_execution_id: string;
    run_id:string
}

export type pathSESCRids = {
    simulation_execution_id: string;
    scenario_id:string;
    run_id:string
}