<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEmployeeScheduleRequest;
use App\Http\Requests\UpdateEmployeeScheduleRequest;
use App\Http\Resources\EmployeeScheduleResource;
use App\Models\EmployeeSchedule;

use Illuminate\Support\Facades\Input;

class EmployeeScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EmployeeScheduleResource::collection(
            EmployeeSchedule::query()->orderBy('id', 'desc')->paginate(100)
        );
    }

    public function mySchedules(Request $request)
    {
        $id = $request->route('id');
        return EmployeeScheduleResource::collection(
            EmployeeSchedule::query()->where('employee_id', $id)->orderBy('id', 'desc')->paginate(100)
        );
    }

    public function removeSchedules(Request $request)
    {
        $id = $request->route('id');
        $employeeSchedule = EmployeeSchedule::where('employee_id', $id)->first();
        $employeeSchedule->delete();

        return response("", 204);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeScheduleRequest $request)
    {
        $data = $request->validated();

        $schedule = EmployeeSchedule::create($data);

        return response(new EmployeeScheduleResource($schedule), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeSchedule $employeeSchedule)
    {
        return new EmployeeScheduleResource($employeeSchedule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeScheduleRequest $request, EmployeeSchedule $employeeSchedule)
    {
        $data = $request->validated();

        $employeeSchedule->update($data);

        return response(new EmployeeScheduleResource($employeeSchedule));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeSchedule $employeeSchedule)
    {
        $employeeSchedule->delete();

        return response("", 204);
    }
}
