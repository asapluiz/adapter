import { JSONSchemaType } from 'ajv';
import { 
    SimulationRunResultData, 
    VideoResultData, 
    DebugUiResultData,
    RTCFailure,
    RtcSimulationRunInterpretation ,
    RtcFailureReason, RtcPhaseObservationInterpretation,
    RtcConstraintEvaluationMap, RtcConstraintEvaluation
} from '../simulations_types';




const RtcFailureReason: JSONSchemaType<RtcFailureReason> = {
    "type": "object",
    "properties": {
      "phaseName": { "type": "string", nullable:true },
      "phaseId": { "type": "string", nullable:true },
      "reasonType": { "type": "string" },
      "textualDescription": { "type": "string" }
    },
    "required": ["reasonType", "textualDescription"]
}

// const RTCFailure: JSONSchemaType<RTCFailure> = {
//     "type": "object",
//     "properties": {
//         "timestamp": { "type": "number" },
//         "reasons": {
//         "type": "array",
//         "items": RtcFailureReason
//         }
//     },
//     "required": ["timestamp", "reasons"], 
//     // nullable: true
      
// }

const RtcConstraintEvaluation: JSONSchemaType<RtcConstraintEvaluation> = {
    "type": "object",
    "properties": {
      "constraintId": { "type": "string" },
      "startTime": { "type": "number" },
      "endTime": { "type": "number" },
      "maximalObservedValue": { "type": "number" },
      "minimalObservedValue": { "type": "number" },
      "fulfillmentType": { "type": "string" }
    },
    "required": [
        "constraintId",
        "startTime",
        "endTime",
        "maximalObservedValue",
        "minimalObservedValue",
        "fulfillmentType"
    ]
}

const RtcConstraintEvaluationMap: JSONSchemaType<RtcConstraintEvaluationMap> = {
    "type": "object",
    "properties": {
        "additionalProperties": RtcConstraintEvaluation
    },
    "required": ["additionalProperties"]
}

const RtcPhaseObservationInterpretation: JSONSchemaType<RtcPhaseObservationInterpretation> = {
    "type": "object",
    "properties": {
      "phaseName": { "type": "string", nullable:true },
      "phaseId": { "type": "string", nullable:true },
      "startTime": { "type": "number" },
      "endTime": { "type": "number" },
      "constraints": RtcConstraintEvaluationMap
    },
    "required": ["startTime", "endTime", "constraints"]
}

// const RtcSimulationRunInterpretation: JSONSchemaType<RtcSimulationRunInterpretation> = {
//     "type": "object",
//     "properties": {
//       "phases": {
//         "type": "array",
//         "items": RtcPhaseObservationInterpretation
//       },
//       "constraints": RtcConstraintEvaluationMap,
//       "coverage": { "type": "boolean" }
//     },
//     "required": ["phases", "constraints", "coverage"], 
//     // nullable: true
// }

  
const DebugUiResultData: JSONSchemaType<DebugUiResultData> = {
    "type": "object",
    "properties": {
      "type": { "type": "string" },
      "debugLink": { "type": "string" }
    },
    "required": ["type", "debugLink"]
}

const VideoResultData: JSONSchemaType<VideoResultData> = {
    "type": "object",
    "properties": {
      "type": { "type": "string" },
      "videoUrl": { "type": "string" }
    },
    "required": ["type", "videoUrl"]
}

const simulationRunResultSchema: JSONSchemaType<SimulationRunResultData> =  {
    "type": "object",
    "properties": {
      "state": { "type": "string", nullable: true },
      "weaknessScore": { "type": "number", nullable: true },
      "started": { "type": "string", "format": "date-time", nullable: true },
      "finished": { "type": "string", "format": "date-time", nullable: true },
      "errorReason": { "type": "string", nullable: true },
      "extraData": {
        "type": "array",
        "items": {
          "anyOf": [
            DebugUiResultData,
            VideoResultData
          ]
        }, nullable: true
      },
      "rtcFailure": {
        "type": "object",
        "properties": {
            "timestamp": { "type": "number" },
            "reasons": {
            "type": "array",
            "items": RtcFailureReason
            }
        },
        "required": ["timestamp", "reasons"], 
        nullable: true 
    },
      "rtcValues": {
        "type": "object",
        "properties": {
          "phases": {
            "type": "array",
            "items": RtcPhaseObservationInterpretation
          },
          "constraints": RtcConstraintEvaluationMap,
          "coverage": { "type": "boolean" }
        },
        "required": ["phases", "constraints", "coverage"], 
        nullable: true
    },
      "traceUrl": { "type": "string", nullable: true }
    },
    "required": [],
    "additionalProperties": false
}

export default simulationRunResultSchema
  