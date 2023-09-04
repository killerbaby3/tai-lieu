<?php
defined('DOCUMENT_ROOT') || define('DOCUMENT_ROOT', realpath(dirname(__FILE__).'/../../public'));
defined('APPLICATION_PATH')
        || define('APPLICATION_PATH', realpath(DOCUMENT_ROOT . '/../module'));
// Define application environment
defined('APPLICATION_ENV')
        || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
defined('ZONE_ENV')
        || define('ZONE_ENV', (getenv('ZONE_ENV') ? getenv('ZONE_ENV') : 'hn'));
defined('SITE_ROOT') || define('SITE_ROOT', realpath(DOCUMENT_ROOT . '/..'));
define("MCRYPT_DEV_URANDOM","myvne");
    
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
    
chdir(SITE_ROOT);
define("FROM_JOB",1);
/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
//chdir(dirname(__DIR__));

// Decline static file requests back to the PHP built-in webserver
if (php_sapi_name() === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}
set_include_path(implode(PATH_SEPARATOR, array(
    get_include_path()
)));
// Setup autoloading
require 'config/defined.php';
require 'config/keycache.php';
//var_dump($configModule); die;
// Run the application!
// This example assumes ZF is on your include_path.
// You could also load the autoloader class from a path relative to the
// current script, or via an absolute path.
//$zf2Path = get_include_path().'/';
require_once 'Zend2/Zend/Loader/StandardAutoloader.php';
//if ZF2 is on php include_path set autoregister_zf to true else false
$loader = new Zend\Loader\StandardAutoloader(array(
    'autoregister_zf' => true,
    'namespaces' => array(
        'Job\Model' => SITE_ROOT . '/server/Job/Model',
        'Fpt'  => SITE_ROOT. '/library/Fpt',
        'MyVnexpress'  => SITE_ROOT . '/library/MyVnexpress',
    )
));
// register library
$loader->register();

use Zend\Mvc\Service\ServiceManagerConfig;
use Zend\ServiceManager\ServiceManager;
use MyVnexpress\Services\Manager;
use Zend\Stdlib\Glob;
use Zend\View\Renderer\PhpRenderer;

// set config for service config
$configService = require APPLICATION_PATH.'/MyVne/config/services.config.php';
$configAppPath = require 'config/application.config.php';
$configApp = array();
foreach ($configAppPath['module_listener_options']['config_glob_paths'] as $path) {
    foreach (Glob::glob($path, Glob::GLOB_BRACE) as $file) { 
        $configApp = array_merge($configApp, require $file);
    }
}
// setup autoloader
// setup service manager
$serviceManager = new ServiceManager(new ServiceManagerConfig($configService));
$serviceManager->setService('Config', $configApp);
$serviceManager->setService('ViewRender', new PhpRenderer());
Manager::setServiceLocator($serviceManager);

// var_dump('<pre>',mktime(0, 0, 1, 9, 1, 2022));die;
if (isset($_SERVER['argv'][1]) && function_exists($_SERVER['argv'][1])) {
    $_SERVER['argv'][1]();
}else{
    die('Không tồn tại Function !');
}

function crawl_award(){
    $arrData = getContent('https://docs.google.com/spreadsheets/d/1UO-4vX6m9vJ2vHNkWSNrkNndcFWGeINmpGDyBMmKW6w/gviz/tq?tqx=out:csv&sheet=Ward');
    if (!empty($arrData['data'])) {
        $arrWard = csv_to_array($arrData['data']);
        $objCollect = Manager::getService('Collection');
        $mongoInstance = $objCollect->getMongodb(array('dbname' => 'profile'));
        $arrInsert = [];
        $id = 1;
        $arrProvince = [];
        foreach ($arrWard as $val) {
            if (!empty($val['Tên'])) {
                $p_id = intval($val['Mã TP']);
                $d_id = intval($val['Mã QH']);
                $arrInsert[$id] = array(
                    '_id' => $id,
                    'name' => $val['Tên'],
                    'level' => $val['Cấp'],
                    'district_id' => $d_id,
                    'province_id' => $p_id,
                );
                $id++;
                $arrProvince[$p_id] = $p_id;
            }
        }
        $res = $mongoInstance->deleteAll('ward');
        $res = $mongoInstance->insertAll('ward', $arrInsert);
        $modelLocation = $objCollect->getModel('Location');
        foreach ($arrProvince as $p_id) {
            $modelLocation->getWardByProvince($p_id,true);
        }
        var_dump('<pre>',$res);die;
    }
}

function crawl_district(){
    $arrData = getContent('https://docs.google.com/spreadsheets/d/1UO-4vX6m9vJ2vHNkWSNrkNndcFWGeINmpGDyBMmKW6w/gviz/tq?tqx=out:csv&sheet=District');
    if (!empty($arrData['data'])) {
        $arrData = csv_to_array($arrData['data']);
        $objCollect = Manager::getService('Collection');
        $mongoInstance = $objCollect->getMongodb(array('dbname' => 'profile'));
        $arrInsert = [];
        $arrProvince = [];
        foreach ($arrData as $val) {
            if (!empty($val['Tên'])) {
                $p_id = intval($val['Mã TP']);
                $d_id = intval($val['Mã']);
                $arrInsert[] = array(
                    'name' => $val['Tên'],
                    'district_id' => $d_id,
                    'province_id' => $p_id,
                );
                $arrProvince[$p_id] = $p_id;
            }
        }
        $res = $mongoInstance->deleteAll('district');
        $res = $mongoInstance->insertAll('district', $arrInsert);
        $modelLocation = $objCollect->getModel('Location');
        foreach ($arrProvince as $p_id) {
            $modelLocation->getDistrictByProvince($p_id,true);
        }
        var_dump('<pre>',$res);die;
    }
}


function getContent($url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/8.0.552.224 Safari/534.10');
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_TIMEOUT, 5);
    $data = curl_exec($curl);
    $info = curl_getinfo($curl);
    $error =  curl_error($curl);
    curl_close($curl);
    return array(
        'data' => $data,
        'header' => $info,
        'error' => $error
    );
}

function csv_to_array($csv)
{
    $data = str_getcsv($csv, "\n");
    $header = NULL;
    foreach ($data as &$row)
    {
        if(!$header)
        {
            $header = str_getcsv($row, ",");
        }
        else
        {
            $row = array_combine($header, str_getcsv($row, ","));
        }
    }
    array_shift($data);
    return $data;
}