<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\EmployeeScheduleController;
use App\Http\Controllers\Api\HolidayController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\LeaveController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/employee', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/employees', EmployeeController::class);

    Route::apiResource('/schedules', ScheduleController::class);

    Route::apiResource('/employee-schedules', EmployeeScheduleController::class);

    Route::get('/my-schedules/{id}', [EmployeeScheduleController::class, 'mySchedules']);
    Route::delete('/my-schedules/{id}', [EmployeeScheduleController::class, 'removeSchedules']);

    Route::apiResource('/holidays', HolidayController::class);

    Route::apiResource('/attendances', AttendanceController::class);
    Route::get('/my-attendance/{id}', [AttendanceController::class, 'myAttendances']);

    Route::apiResource('/leaves', LeaveController::class);
    Route::get('/my-leaves/{id}', [LeaveController::class, 'myLeaves']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
