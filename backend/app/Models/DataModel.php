<?php
require_once __DIR__ . '/../Helpers/UtilityFunctions.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

class DataModel {
    private $inputFileName = __DIR__ . '/../../Technical Assessment Data.xlsx';

    public function loadData() {
        if (!file_exists($this->inputFileName)) {
            throw new Exception("File not found: {$this->inputFileName}");
        }

        $reader = new Xlsx();
        $spreadsheet = $reader->load($this->inputFileName);
        $sheet = $spreadsheet->getSheet(0);
        $sheetData = $sheet->toArray();

        unset($sheetData[0]);
        return $sheetData;
    }

    public function calculateAverageScores($data) {
        return UtilityFunctions::calculateAverageScores($data);
    }

    public function getDepartmentDistribution($data) {
        return array_count_values(array_column($data, 13));
    }

    public function getCompletedSurveysByLocation($data) {
        return UtilityFunctions::getCompletedSurveysByLocation($data);
    }

    public function getCompletedSurveysByDept($data) {
        return UtilityFunctions::getCompletedSurveysByDept($data);
    }

    public function getCompletedSurveysByYear($data) {
        return UtilityFunctions::getCompletedSurveysByYear($data);
    }

    public function getYearDistribution($data) {
        return array_count_values(array_column($data, 11));
    }

    public function getHeatmapData($data) {
        return UtilityFunctions::getHeatmapData($data);
    }

    public function calculateCorrelations($data) {
        return UtilityFunctions::calculateCorrelations($data);
    }

    public function getComments($data) {
        return UtilityFunctions::getComments($data);
    }

    public function calculateAverageScoresByQuestion($data, $filter = []) {
        return UtilityFunctions::calculateAverageScoresByQuestion($data, $filter);
    }

    public function analyzeSentiments($data, $filters) {
        $comments = UtilityFunctions::getFilteredComments($data, $filters);
        return UtilityFunctions::analyzeSentiment($comments);
    }

}
