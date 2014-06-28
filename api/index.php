<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
date_default_timezone_set('America/Chicago');
require_once 'meekrodb.2.1.class.php';
//echo $_SERVER['HTTP_HOST'];

//echo $_SERVER['SERVER_NAME'];

// switch ($_GET['env']) {
//     case 'dev':
//         require_once 'db.config.dev.php';
//         break;
//     default:
//         require_once 'db.config.prod.php';
//          break;
// }
 switch ($_SERVER['SERVER_NAME']) {
     case 'timeclock-macchad.rhcloud.com' :
         require_once 'db.config.prod.php';
         break;
    default:
        require_once 'db.config.dev.php';
        break;
     //default :
     //    require_once 'db.config.dev.php';
     //    break;
 }

DB::$param_char = '%%';

switch ($_GET['action']) {

    //users
    case 'usersAdd' :
        //-add = add new employee
        //---pass in name (required)
        //---return success/fail
        if (isset($_GET['name'])) {
           // $results = DB::insert('users', array('name' => $_GET['name']));
            $columns = array();
            $columns['name'] = $_GET['name'];
            if (isset($_GET['pin'])) {
                $columns['pin'] = $_GET['pin'];
            }
            $results = DB::insert('users', $columns);
        }
    break;

    case 'usersGet' :
        //-get = employee drop down, list of active/inactive users
        //---pass in active (required)
        //---return id, name, active
        if (isset($_GET['active'])) {
            $results = DB::query('SELECT id, name, active, pin FROM users WHERE active=%%s ORDER BY name ASC', $_GET['active']);
        }
    break;
    
    case 'userGet' :
        if (isset($_GET['id'])) {
            $results = DB::query('SELECT id, name, active, pin FROM users WHERE id=%%s ORDER BY name ASC', $_GET['id']);
        }
    break;
        
    case 'usersUpdate' :
        // update = change status
        // pass in id (required)
        // return success/fail
        if (isset($_GET['id'])) {
            $results = DB::update('users', array('active' => DB::sqleval("NOT active")), 'id=%%s', $_GET['id']);
        }
    break;
    case 'updateUserDetails' :
        // update = change user details
        // pass in id (required), other changed fields
        // return success/fail
         $columns = array();
            if (isset($_GET['name'])) {
                $columns['name'] = $_GET['name'];
            }
            $columns['name'] = $_GET['name'];
            if (isset($_GET['pin'])) {
                $columns['pin'] = $_GET['pin'];
            }
        if (isset($_GET['id'])) {
            $results = DB::update('users', $columns, 'id=%%s', $_GET['id']);
        }
    break;

    //clock
    case 'clockAdd' :
        //-add = clock in, add new
        //---pass in user id (required), time in (optional with default), time out (optional)
        //---return success/fail
        if (isset($_GET['user'])) {
            $columns = array();
            $columns['uid'] = $_GET['user'];
            $columns['clockIn'] = isset($_GET['start']) ? $_GET['start'] : date('Y-m-d H:i:s');
            $columns['clockOut'] = isset($_GET['end']) ? $_GET['end'] : NULL;
            $results = DB::insert('clock', $columns);
        }
    break;

    case 'clockGet' :
        //-get = current, past, report
        //---pass in start date and end date (optional), user id (required)
        //---return id, user id, date, clock in, clock out
        if (isset($_GET['user'])) {
            if (isset($_GET['start']) && isset($_GET['end'])) {
                $results = DB::query('SELECT id, DATE_FORMAT(clockIn, "%a, %b %e") as clockInDate, DATE_FORMAT(clockIn, "%l:%i %p") as clockInTime, DATE_FORMAT(clockOut, "%l:%i %p") as clockOutTime, ROUND(TIMESTAMPDIFF(MINUTE, clockIn, clockOut)/60, 2) as totalTime FROM clock WHERE uid=%%s AND (clockIn >= %%s AND clockIn < %%s) ORDER BY clockIn DESC', $_GET['user'], $_GET['start'], $_GET['end']);
            } else {
                $results = DB::queryFirstRow('SELECT id, clockIn, clockOut FROM clock WHERE uid=%%s ORDER BY clockIn DESC', $_GET['user']);
            }
        }
    break;

    case 'clockUpdate' :
        //-update = clock out, edit
        //---pass in id (required), time in (optional), time out (optional)
        //---return success/fail
        if (isset($_GET['id'])) {
            $columns = array();
            if (isset($_GET['start'])) {
                $columns['clockIn'] = $_GET['start'];
            }
            if (isset($_GET['end'])) {
                $columns['clockOut'] = $_GET['end'];
            }
            $results = DB::update('clock', $columns, "id=%%s", $_GET['id']);
        }
    break;
    case 'userDelete' :
        //-delete = remove error
        //---pass in id (required)
        //---return success/fail
        if (isset($_GET['id'])) {
            $results = DB::delete('users', "id=%%s", $_GET['id']);
        }
    break;

    case 'clockDelete' :
        //-delete = remove error
        //---pass in id (required)
        //---return success/fail
        if (isset($_GET['id'])) {
            $results = DB::delete('clock', "id=%%s", $_GET['id']);
        }
    break;


}

//return query results as JSON
echo json_encode($results);




// //  GET docs DATA FROM HTTP REQUEST POST
// $data = json_decode(file_get_contents('php://input'), true);
 
// if($data) {
// 	//i drilled down to the data i want thats coming from a couchdb instance
// 	$docs = $data['params']['docs']['docs'];
 
// 	//need to get the right encoding so I encode it and decode from json
// 	$json_str = json_encode($docs, JSON_UNESCAPED_UNICODE);
// 	$json_obj = json_decode ($json_str);
 
// 	//we will temporarilly save the CSV data in a string variable
// 	$csv = "";
 
// 	$fieldNames = array();
	
// 	//first we iterate the array/json object and get all the possible 'field/column names' (because is json not all records have the same keys like a SQL database)
// 	foreach ($docs as $row) {
// 		foreach ($row['value'] as $key=>$value) {
// 			//here we check if we've added the field yet and whether or not its an array.  we only add it if its a string or integer
// 			if(!in_array($key, $fieldNames) AND !is_array($value) AND $key != "_id" AND $key != "_rev") {
// 				array_push($fieldNames, $key);
// 			}
// 		}
// 	}
 
// 	//add the field names to the first row in the csv file
// 	for ($i = 0; $i < count($fieldNames); ++$i) {
// 		$csv = $csv . $fieldNames[$i] . ",";
// 	}
// 	$csv = $csv . "\r\n";
 
// 	//iterate through each record in the json data and check if it contains any of the keys in the $fieldNames array
// 	foreach ($docs as $row) {
// 		$newArray =  (array) $row['value'];
// 		for ($i = 0; $i < count($fieldNames); ++$i) {
// 			if(in_array($fieldNames[$i], array_keys($newArray))) {
// 				//if the key is found, add the value to the csv and add a comma (if not, just add a comma for an empty column)
// 				$csv = $csv . preg_replace( "/\r|\n/", " ", str_replace(",","",$newArray[$fieldNames[$i]])) . ",";
// 			} else {
// 				$csv = $csv . ", ";
// 			}
// 		}
// 		$csv = $csv . "\r\n";
// 	}
 
 
 
// 	$exportedFilename = "data-export-" . date("Y-m-d_H-i-s") . '.csv';
// 	$fp = fopen($exportedFilename, 'w');
// 	fwrite($fp, $csv);
// 	fclose($fp);
 
// 	$url = array('url' => '/assetdb/csv/'. $exportedFilename);
// 	$fileObj = json_encode($url);
// 	header('Content-Type: application/json');
// 	echo $fileObj;
 
// } else {
// 	echo "No data was provided.";
// }
