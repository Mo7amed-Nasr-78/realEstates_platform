import React from "react";
import {
    PiArrowRight,
    PiArrowLeft,
} from 'react-icons/pi';
import { days, months } from "../../Data/Data";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Alert from "./Alert";

function Calendar({ onApply, onCancel }) {

    const daysOfMonthRef = useRef(null);

    const today = new Date();
    const [ selectDay, setSelectDay ] = useState(null);
    const [ currentMonth, setCurrentMonth ] = useState(today.getMonth());
    const [ currentYear, setCurrentYear ] = useState(today.getFullYear());

    const firstDay = new Date(currentYear, currentMonth).getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Days of Month
    useEffect(() => {
        const daysOfMonth = daysOfMonthRef.current;
        if (!daysOfMonth) return;
        daysOfMonth.textContent = '';

        for (let i = 1; i <= firstDay; i++) {
            const li = document.createElement('li');
            li.className = `min-w-8 min-h-8 sm:min-w-10 sm:min-h-10 rounded-full flex items-center justify-center text-base sm:text-lg text-(--secondary-text)/50 hover:bg-(--primary-color) cursor-pointer`;
            li.textContent = daysInPrevMonth - i;
            daysOfMonth.append(li);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            const beforeToday = currentMonth < new Date().getMonth() && currentYear < new Date().getFullYear();
            const li = document.createElement('li');
            li.className = `dayNum ${isToday? 'border border-(--primary-color)': ''} ${beforeToday? 'text-(--secondary-text)/50 cursor-not-allowed': 'text-(--primary-text) hover:bg-(--primary-color) cursor-pointer'} min-w-8 min-h-8 sm:min-w-10 sm:min-h-10 rounded-full flex items-center justify-center text-base sm:text-lg duration-300 ease-in-out`;
            li.textContent = i;
            li.onclick = () => {
                setSelectDay(i);
            }
            daysOfMonth.append(li);
        }
    }, [daysOfMonthRef, currentMonth, currentYear]);

    useEffect(() => {
        document.querySelectorAll('.dayNum').forEach((li) => {
            if (selectDay === +li.textContent) {
                li.classList.add('bg-(--primary-color)');
            } else {
                li.classList.remove('bg-(--primary-color)');
            }
        })
    }, [selectDay, currentMonth, currentYear]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    const handleApplying = (event) => {
        event.preventDefault();

        if (!selectDay) {
            Alert('warning', 'select the day that fits your time');
            return;
        } 

        if (currentYear === new Date().getFullYear() && currentMonth < new Date().getMonth()) {
            Alert('warning', 'invalid date selection');
            return;
        } else if (currentYear < new Date().getFullYear()) {
            Alert('warning', 'invalid date selection');
            return;
        } else {
            onApply?.(`${selectDay}/${currentMonth + 1}/${currentYear}`);
            onCancel?.(false);
        }

    }

    return (
        <div className="absolute bottom-full left-0 w-full sm:w-80 bg-(--bg-color) outline outline-offset-1 outline-white/10 rounded-xl shadow-sm shadow-white/10 p-3 mt-80">
            <div className="flex items-center justify-between mb-3">
                <div onClick={handlePrevMonth} className="min-w-10 min-h-10 flex items-center justify-center rounded-full text-(--primary-color) duration-300 ease-in-out hover:text-(--primary-text) hover:bg-(--primary-color) cursor-pointer">
                    <PiArrowLeft className="text-xl" />
                </div>
                <h1 className="font-Plus-Jakarta-Sans font-medium text-base sm:text-lg text-(--primary-text) capitalize select-none">{ months[currentMonth] }, { currentYear }</h1>
                <div onClick={handleNextMonth} className="min-w-10 min-h-10 flex items-center justify-center rounded-full text-(--primary-color) duration-300 ease-in-out hover:text-(--primary-text) hover:bg-(--primary-color) cursor-pointer">
                    <PiArrowRight className="text-xl" />
                </div>
            </div>
            <ul className="w-full grid grid-cols-7 gap-2">
                {
                    days.map((day, idx) => {
                        return (
                            <li key={idx} className="grid-col-7 w-10 h-10 flex items-center justify-center font-Plus-Jakarta-Sans font-medium text-sm sm:text-base text-(--primary-text) capitalize">{ day }</li>
                        )
                    })
                }
            </ul>
            <ul ref={daysOfMonthRef}  className="w-full grid grid-cols-7 gap-3 sm:gap-2 mb-4"></ul>
            <div className="flex items-center justify-end gap-3">
                <button onClick={handleApplying} className="font-Plus-Jakarta-Sans font-normal py-1.5 px-4 text-sm capitalize text-(--primary-text) border border-(--primary-color) rounded-xl cursor-pointer duration-300 ease-in-out hover:scale-95 hover:bg-(--primary-color)">apply</button>
                <button onClick={() => onCancel?.(false)} className="font-Plus-Jakarta-Sans font-normal py-1.5 px-4 text-sm capitalize text-(--primary-text) border border-(--primary-color) rounded-xl cursor-pointer duration-300 ease-in-out hover:scale-95 hover:bg-(--primary-color)">cancel</button>
            </div>
        </div>
    )
}

export default Calendar;