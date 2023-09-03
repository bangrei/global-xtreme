<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;
use App\Http\Resources\LeaveResource;
use Illuminate\Http\Request;
use App\Models\Leave;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LeaveResource::collection(
            Leave::query()->orderBy('id', 'desc')->paginate(100)
        );
    }

    public function myLeaves(Request $request)
    {
        $id = $request->route('id');
        return LeaveResource::collection(
            Leave::query()->where('employee_id', $id)->orderBy('id', 'desc')->paginate(100)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequest $request)
    {
        $data = $request->validated();

        $leave = Leave::create($data);

        return response(new LeaveResource($leave), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Leave $leave)
    {
        return new LeaveResource($leave);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave)
    {
        $data = $request->validated();

        $leave->update($data);

        return response(new LeaveResource($leave));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave)
    {
        $leave->delete();
        return response("", 204);
    }
}
