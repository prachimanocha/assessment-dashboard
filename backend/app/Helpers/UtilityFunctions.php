<?php

class UtilityFunctions {
    public static function calculateAverageScores($data) {
        $scoresByLocation = [];
        $scoresByDept = [];
        $scoresByYear = [];

        foreach ($data as $row) {
            $location = $row[12] ?? null;
            $department = $row[13] ?? null;
            $year = $row[11] ?? null;
            $score = isset($row[9]) ? (float)$row[9] : null;

            if ($location && $score !== null) {
                if (!isset($scoresByLocation[$location])) {
                    $scoresByLocation[$location] = [];
                }
                $scoresByLocation[$location][] = $score;
            }

            if ($department && $score !== null) {
                if (!isset($scoresByDept[$department])) {
                    $scoresByDept[$department] = [];
                }
                $scoresByDept[$department][] = $score;
            }

            if ($year && $score !== null) {
                if (!isset($scoresByYear[$year])) {
                    $scoresByYear[$year] = [];
                }
                $scoresByYear[$year][] = $score;
            }
        }

        $averageScoresByLocation = array_map(function($scores) {
            return array_sum($scores) / count($scores);
        }, $scoresByLocation);

        $averageScoresByDept = array_map(function($scores) {
            return array_sum($scores) / count($scores);
        }, $scoresByDept);

        $averageScoresByYear = array_map(function($scores) {
            return array_sum($scores) / count($scores);
        }, $scoresByYear);

        return [
            'locationScores' => $averageScoresByLocation,
            'departmentScores' => $averageScoresByDept,
            'yearScores' => $averageScoresByYear,
        ];
    }

    public static function getCompletedSurveysByLocation($data) {
        $categoryCounts = [];
        $completedSurveysByLocation = [];

        foreach ($data as $row) {
            $voterId = $row[0] ?? null;
            $location = $row[12] ?? null;
            $parentQuestion = $row[4] ?? null;

            if (!isset($categoryCounts[$voterId])) {
                $categoryCounts[$voterId] = [];
            }

            if ($parentQuestion && !in_array($parentQuestion, $categoryCounts[$voterId])) {
                $categoryCounts[$voterId][] = $parentQuestion;
            }

            if (count($categoryCounts[$voterId]) === 9) {
                if (!isset($completedSurveysByLocation[$location])) {
                    $completedSurveysByLocation[$location] = 0;
                }
                $completedSurveysByLocation[$location]++;
            }
        }

        return $completedSurveysByLocation;
    }

    public static function getCompletedSurveysByDept($data) {
        $categoryCounts = [];
        $completedSurveysByDept = [];

        foreach ($data as $row) {
            $voterId = $row[0] ?? null;
            $department = $row[13] ?? null;
            $parentQuestion = $row[4] ?? null;

            if (!isset($categoryCounts[$voterId])) {
                $categoryCounts[$voterId] = [];
            }

            if ($parentQuestion && !in_array($parentQuestion, $categoryCounts[$voterId])) {
                $categoryCounts[$voterId][] = $parentQuestion;
            }

            if (count($categoryCounts[$voterId]) === 9) {
                if (!isset($completedSurveysByDept[$department])) {
                    $completedSurveysByDept[$department] = 0;
                }
                $completedSurveysByDept[$department]++;
            }
        }

        return $completedSurveysByDept;
    }

    public static function getCompletedSurveysByYear($data) {
        $categoryCounts = [];
        $completedSurveysByYear = [];

        foreach ($data as $row) {
            $voterId = $row[0] ?? null;
            $year = $row[11] ?? null;
            $parentQuestion = $row[4] ?? null;

            if (!isset($categoryCounts[$voterId])) {
                $categoryCounts[$voterId] = [];
            }

            if ($parentQuestion && !in_array($parentQuestion, $categoryCounts[$voterId])) {
                $categoryCounts[$voterId][] = $parentQuestion;
            }

            if (count($categoryCounts[$voterId]) === 9) {
                if (!isset($completedSurveysByYear[$year])) {
                    $completedSurveysByYear[$year] = 0;
                }
                $completedSurveysByYear[$year]++;
            }
        }

        return $completedSurveysByYear;
    }

    public static function getComments($data) {
        $comments = array_map(function($row) {
            return $row[10] ?? null;
        }, $data);

        return array_filter($comments);
    }

    public static function getFilteredComments($data, $filters) {
        $filteredData = array_filter($data, function($row) use ($filters) {
            $locationFilter = $filters['location'] ?? '';
            $departmentFilter = $filters['department'] ?? '';
            $yearFilter = $filters['year'] ?? '';

            $location = $row[12] ?? '';
            $department = $row[13] ?? '';
            $year = $row[11] ?? '';

            $locationMatch = !$locationFilter || $location == $locationFilter;
            $departmentMatch = !$departmentFilter || $department == $departmentFilter;
            $yearMatch = !$yearFilter || $year == $yearFilter;
            
            return $locationMatch && $departmentMatch && $yearMatch;
        });

        $comments = array_map(function($row) {
            return $row[10] ?? null;
        }, $filteredData);

        return array_filter($comments);
    }
  
    public static function analyzeSentiment($comments) {
        $apiKey = 'YOUR_OPENAI_KEY';
        $sentiments = [];
        $batchSize = 5;
        $batches = array_chunk($comments, $batchSize);

        foreach ($batches as $batch) {
            $prompts = [];
            foreach ($batch as $comment) {
                $prompts[] = ['role' => 'user', 'content' => "Analyze the sentiment of the following comment: \"$comment\". Respond with only 'Positive', 'Neutral', or 'Negative'."];
            }

            $data = [
                'model' => 'gpt-3.5-turbo',
                'messages' => array_merge([['role' => 'system', 'content' => 'You are a sentiment analysis model.']], $prompts),
                'max_tokens' => 10,
            ];

            $ch = curl_init('https://api.openai.com/v1/chat/completions');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

            $response = curl_exec($ch);
            if ($response === false) {
                $error = 'Curl error: ' . curl_error($ch);
                error_log($error);
                curl_close($ch);
                throw new Exception($error);
            }

            curl_close($ch);
            $result = json_decode($response, true);
            error_log('OpenAI API Response: ' . print_r($result, true));

            if (isset($result['choices'])) {
                foreach ($result['choices'] as $index => $choice) {
                    if (isset($choice['message']['content'])) {
                        $sentiment = trim($choice['message']['content']);
                        $sentiments[] = ['comment' => $batch[$index], 'sentiment' => $sentiment];
                    } else {
                        $sentiments[] = ['comment' => $batch[$index], 'sentiment' => 'Error analyzing sentiment'];
                    }
                }
            }
        }

        return $sentiments;
    }
  
    public static function getHeatmapData($data) {
        $heatmapData = [];
        foreach ($data as $row) {
            $question = $row[4] ?? null;
            $location = $row[12] ?? null;
            $department = $row[13] ?? null;
            $year = $row[11] ?? null;
            $score = $row[9] ?? null;

            if ($question && $location && is_numeric($score)) {
                if (!isset($heatmapData[$question])) {
                    $heatmapData[$question] = [];
                }
                if (!isset($heatmapData[$question][$location])) {
                    $heatmapData[$question][$location] = [];
                }
                $heatmapData[$question][$location][] = (float)$score;
            }
            if ($question && $department && is_numeric($score)) {
                if (!isset($heatmapData[$question])) {
                    $heatmapData[$question] = [];
                }
                if (!isset($heatmapData[$question][$department])) {
                    $heatmapData[$question][$department] = [];
                }
                $heatmapData[$question][$department][] = (float)$score;
            }
            if ($question && $year && is_numeric($score)) {
                if (!isset($heatmapData[$question])) {
                    $heatmapData[$question] = [];
                }
                if (!isset($heatmapData[$question][$year])) {
                    $heatmapData[$question][$year] = [];
                }
                $heatmapData[$question][$year][] = (float)$score;
            }
        }

        $averageHeatmapData = [];
        foreach ($heatmapData as $question => $locations) {
            foreach ($locations as $location => $scores) {
                if (!isset($averageHeatmapData[$question])) {
                    $averageHeatmapData[$question] = [];
                }
                $averageHeatmapData[$question][$location] = array_sum($scores) / count($scores);
            }
        }
        foreach ($heatmapData as $question => $departments) {
            foreach ($departments as $department => $scores) {
                if (!isset($averageHeatmapData[$question])) {
                    $averageHeatmapData[$question] = [];
                }
                $averageHeatmapData[$question][$department] = array_sum($scores) / count($scores);
            }
        }
        foreach ($heatmapData as $question => $years) {
            foreach ($years as $year => $scores) {
                if (!isset($averageHeatmapData[$question])) {
                    $averageHeatmapData[$question] = [];
                }
                $averageHeatmapData[$question][$year] = array_sum($scores) / count($scores);
            }
        }

        return $averageHeatmapData;
    }

    public static function calculateCorrelations($data) {
        $questionScores = [];
        foreach ($data as $row) {
            $question = $row[4] ?? null;
            $score = $row[9] ?? null;

            if ($question && is_numeric($score)) {
                if (!isset($questionScores[$question])) {
                    $questionScores[$question] = [];
                }
                $questionScores[$question][] = (float)$score;
            }
        }

        $questions = array_keys($questionScores);
        $correlationMatrix = [];

        for ($i = 0; $i < count($questions); $i++) {
            $correlationMatrix[$questions[$i]] = [];
            for ($j = 0; $j < count($questions); $j++) {
                $correlationMatrix[$questions[$i]][$questions[$j]] = self::correlation($questionScores[$questions[$i]], $questionScores[$questions[$j]]);
            }
        }

        $overallCorrelations = [];
        foreach ($correlationMatrix as $question => $correlations) {
            $overallCorrelations[$question] = array_sum($correlations) / count($correlations);
        }

        arsort($overallCorrelations);
        return $overallCorrelations;
    }

    private static function correlation($x, $y) {
        $n = count($x);
        if ($n !== count($y) || $n === 0) {
            return 0;
        }

        $sumX = array_sum($x);
        $sumY = array_sum($y);
        $sumXY = 0;
        $sumX2 = 0;
        $sumY2 = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += $x[$i] * $y[$i];
            $sumX2 += $x[$i] * $x[$i];
            $sumY2 += $y[$i] * $y[$i];
        }

        $numerator = ($n * $sumXY) - ($sumX * $sumY);
        $denominator = sqrt(($n * $sumX2 - $sumX * $sumX) * ($n * $sumY2 - $sumY * $sumY));

        if ($denominator == 0) {
            return 0;
        }

        return $numerator / $denominator;
    }

    public static function calculateAverageScoresByQuestion($data, $filter = []) {
        $scoresByQuestion = [];

        foreach ($data as $row) {
            $location = $row[12] ?? '';
            $department = $row[13] ?? '';
            $year = $row[11] ?? '';
            $question = $row[6] ?? null;
            $score = isset($row[9]) ? (float)$row[9] : null;

            if ($question && $score !== null) {
                if ((!empty($filter['location']) && $filter['location'] != $location) ||
                    (!empty($filter['department']) && $filter['department'] != $department) ||
                    (!empty($filter['year']) && $filter['year'] != $year)) {
                    continue;
                }
                if (!isset($scoresByQuestion[$question])) {
                    $scoresByQuestion[$question] = [];
                }
                $scoresByQuestion[$question][] = $score;
            }
        }

        $averageScoresByQuestion = array_map(function($scores) {
            return array_sum($scores) / count($scores);
        }, $scoresByQuestion);

        return $averageScoresByQuestion;
    }
}
?>
