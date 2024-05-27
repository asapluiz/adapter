export const dummy_simulation_data = {
    "sutId": "a3364909-73dd-4095-962a-eff1bad63545",
    "createdBy": "Louis Asimhi",
    "simulationName": "first simulation data",
    "scenarioData":[
        {"id":"a3364909-73dd-4095-962a-eff1bad63333","name":"simulationScenario1","content":"dummy data","description":"describe dummy data string"},
        {"id":"a3364909-73dd-4095-962a-eff1bad63545","name":"simulationScenario2","content":"dummy data2","description":"describe dummy data4"}
    ],
    "recordSignals": ["signal1", "signal2"]
}

export const dummy_sut_data = {
    "name": "Giant Sut",
    "description": "this is the best sut in the market",
    "signals": ["Ego_ttc", "fellow_speed"]
}

export const dummy_info_data = {
    "name": "test info",
    "numberOfParallelExecutions": 3,
    "version": "1",
    "requiresTestEnvironments": true
}

export const dummy_scenario_run_data = {
    "road" : "test road",
    "environment": {
        "visibility": 10,
        "brightness":4,
        "cloudState":9,
        "potholes": 12,
        "precipitation": 30,
        "timeOfDay":100
    },
    "oddParameters": [
        {
            "name": "odd one",
            "value": "odd one value"
        },

        {
            "name": "odd two",
            "value": "odd two value"
        }
    ],

    "parameters": [
        {
            "name":"scenario parameteer one",
            "id": "scenario parameter id one",
            "lower": "lower boundry one",
            "upper": "upper boundry one",
            "unit": "unit one"
        },
        {
            "name":"scenario parameteer two",
            "id": "scenario parameter id two",
            "lower": "lower boundry two",
            "upper": "upper boundry two",
            "unit": "unit two"
        }
    ]
}

