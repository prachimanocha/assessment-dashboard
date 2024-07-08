<?php
require_once __DIR__ . '/../Models/DataModel.php';

class DataController {
    public function handleRequest($params) {
        $dataType = $params['data'] ?? 'none';
        $location = $params['location'] ?? '';
        $department = $params['department'] ?? '';
        $year = $params['year'] ?? '';

        $model = new DataModel();
        $sheetData = $model->loadData();

        $scores = $model->calculateAverageScores($sheetData);

        switch ($dataType) {
            case 'locationScores':
                if ($location) {
                    echo json_encode([$location => $scores['locationScores'][$location] ?? 0]);
                } else {
                    echo json_encode($scores['locationScores']);
                }
                break;
            case 'departmentScores':
                if ($department) {
                    echo json_encode([$department => $scores['departmentScores'][$department] ?? 0]);
                } else {
                    echo json_encode($scores['departmentScores']);
                }
                break;
            case 'yearScores':
                if ($year) {
                    echo json_encode([$year => $scores['yearScores'][$year] ?? 0]);
                } else {
                    echo json_encode($scores['yearScores']);
                }
                break;
            case 'departmentDistribution':
                echo json_encode($model->getDepartmentDistribution($sheetData));
                break;
            case 'completedSurveysByLocation':
                echo json_encode($model->getCompletedSurveysByLocation($sheetData));
                break;
            case 'completedSurveysByYear':
                echo json_encode($model->getCompletedSurveysByYear($sheetData));
                break;
            case 'completedSurveysByDept':
                echo json_encode($model->getCompletedSurveysByDept($sheetData));
                break;    
            case 'yearDistribution':
                echo json_encode($model->getYearDistribution($sheetData));
                break;
            case 'heatmapData':
                echo json_encode($model->getHeatmapData($sheetData));
                break;
            case 'questionCorrelations':
                echo json_encode($model->calculateCorrelations($sheetData));
                break;
            case 'comments':
                echo json_encode($model->getComments($sheetData));
                break;
            case 'questionScores':
                echo json_encode($model->calculateAverageScoresByQuestion($sheetData, ['location' => $location, 'department' => $department, 'year' => $year]));
                break;
            case 'sentiments':
                echo json_encode($model->analyzeSentiments($sheetData, ['location' => $location, 'department' => $department, 'year' => $year]));
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data request']);
                break;
        }
    }
}
