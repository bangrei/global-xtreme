<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\EmployeeSchedule;
use App\Models\Holiday;
use App\Models\Leave;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AttendanceResource::collection(
            Attendance::query()->orderBy('id', 'desc')->paginate(100)
        );
    }

    public function myAttendances(Request $request)
    {
        $id = $request->route('id');
        return AttendanceResource::collection(
            Attendance::query()->where('employee_id', $id)->orderBy('id', 'desc')->paginate(100)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $data = $request->validated();

        $schedule_id = $data['schedule_id'];
        $schedule = EmployeeSchedule::query()->where('id', $schedule_id)->first();

        if(empty($schedule)) return response(['message' => 'Schedule not found!, id:'.$schedule_id]);

        $date = $data['date'];

        $holiday = Holiday::query()->where('date', $date)->first();

        if(!empty($holiday)) return response(['message' => 'It is a public holiday on '.$date]);

        $leave = Leave::query()->where('start', '>=', $date)->where('end', '<=', $date)->first();

        if(!empty($leave)) return response(['message' => 'You are still on Annual leave, Enjoy!']);

        $today = date('H:i');
        
        if(empty($data['in'])) {
            $data['in'] = $today;
        } else {
            if(empty($data['out'])) $data['out'] = $today;
        }

        $attendance = Attendance::query()->where('date', $date)->first();

        if($attendance) {
            $attendance->update($data);
        } else {
            $attendance = Attendance::create($data);
        }

        return response(new AttendanceResource($attendance), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        return new AttendanceResource($attendance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $data = $request->validated();

        if(!empty($attendance->out) && !empty($data['out'])) return response(['message' => 'You already checked out at: '.$attendance->out]);

        $today = date('H:i');
        if(empty($attendance->out)) $data['out'] = $today;

        $attendance->update($data);

        return response(new AttendanceResource($attendance));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return response("", 204);
    }
}
