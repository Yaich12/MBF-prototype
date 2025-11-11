import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon, PlusIcon, XIcon } from '../components/icons';
import { Appointment } from '../types';

interface AppointmentModalProps {
    onClose: () => void;
    onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ onClose, onAddAppointment }) => {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const maxDate = useMemo(() => {
        const d = new Date(today);
        d.setMonth(d.getMonth() + 3);
        return d;
    }, [today]);

    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [displayMonth, setDisplayMonth] = useState<Date>(new Date(today));
    
    const [service, setService] = useState('');
    const [client, setClient] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(60);

    const handleCreateAppointment = () => {
        if (!service || !client) {
            alert('Udfyld venligst ydelse og klient.');
            return;
        }
        onAddAppointment({
            service,
            client,
            date: selectedDate,
            startTime,
            duration,
            color: '#bfdbfe', // A light blue color for appointments
        });
        onClose();
    };


    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateCalendar = () => {
        const year = displayMonth.getFullYear();
        const month = displayMonth.getMonth();
        const days = [];
        const monthDays = daysInMonth(year, month);
        let firstDay = firstDayOfMonth(year, month);
        if (firstDay === 0) firstDay = 7; // Sunday is 0, make it 7
        firstDay--; // Monday is 0

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= monthDays; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const calendarDays = generateCalendar();
    const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

    const handlePrevMonth = () => {
        setDisplayMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            if (newMonth.getFullYear() < today.getFullYear() || (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())) {
                return prev;
            }
            return newMonth;
        });
    }

    const handleNextMonth = () => {
        setDisplayMonth(prev => {
             const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            if (newMonth.getFullYear() > maxDate.getFullYear() || (newMonth.getFullYear() === maxDate.getFullYear() && newMonth.getMonth() > maxDate.getMonth())) {
                return prev;
            }
            return newMonth;
        });
    }

    const isPrevMonthDisabled = displayMonth.getFullYear() === today.getFullYear() && displayMonth.getMonth() === today.getMonth();
    const isNextMonthDisabled = displayMonth.getFullYear() === maxDate.getFullYear() && displayMonth.getMonth() === maxDate.getMonth();
    
    const timeSlots = Array.from({length: 8 * 4}).map((_, i) => {
        const hour = 9 + Math.floor(i / 4);
        const minute = (i % 4) * 15;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Opret ny aftale</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Ydelse</label>
                        <input type="text" placeholder="F.eks. Førstegangskonsultation" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={service} onChange={e => setService(e.target.value)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Klient</label>
                        <input type="text" placeholder="Søg efter klient" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={client} onChange={e => setClient(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Starttid</label>
                            <select value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Varighed</label>
                             <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value={30}>30 minutter</option>
                                <option value={45}>45 minutter</option>
                                <option value={60}>60 minutter</option>
                                <option value={90}>90 minutter</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dato</label>
                        <div className="border rounded-lg p-2">
                             <div className="flex items-center justify-between mb-2">
                                <button onClick={handlePrevMonth} disabled={isPrevMonthDisabled} className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronLeftIcon />
                                </button>
                                <div className="font-semibold text-gray-800">
                                    {displayMonth.toLocaleString('da-DK', { month: 'long', year: 'numeric' })}
                                </div>
                                <button onClick={handleNextMonth} disabled={isNextMonthDisabled} className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronRightIcon />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                {weekDays.map(day => <div key={day} className="font-medium text-gray-500">{day}</div>)}
                                {calendarDays.map((day, index) => {
                                    if (!day) return <div key={index}></div>;
                                    const isDisabled = day < today || day > maxDate;
                                    const isSelected = day.getTime() === selectedDate.getTime();
                                    return (
                                        <button 
                                            key={index}
                                            disabled={isDisabled}
                                            onClick={() => setSelectedDate(day)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                                                isSelected ? 'bg-blue-600 text-white' : 
                                                isDisabled ? 'text-gray-300 cursor-not-allowed' : 
                                                'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {day.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
                        Annuller
                    </button>
                    <button onClick={handleCreateAppointment} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Opret aftale
                    </button>
                </div>
            </div>
        </div>
    );
};


const CalendarPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = {
            id: new Date().toISOString() + Math.random(),
            ...appointmentData
        };
        setAppointments(prev => [...prev, newAppointment]);
    };

    const getWeekStartDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0,0,0,0);
        return d;
    };
    
    const weekStartDate = useMemo(() => getWeekStartDate(currentDate), [currentDate]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(weekStartDate);
            day.setDate(weekStartDate.getDate() + i);
            return day;
        });
    }, [weekStartDate]);
    
    const weekLabel = useMemo(() => {
        const start = weekDays[0];
        const end = weekDays[6];
        const startMonth = start.toLocaleString('da-DK', { month: 'short' });
        const endMonth = end.toLocaleString('da-DK', { month: 'short' });
        if (startMonth === endMonth) {
            return `${start.getDate()}. – ${end.getDate()}. ${endMonth} ${end.getFullYear()}`;
        }
        return `${start.getDate()}. ${startMonth} – ${end.getDate()}. ${endMonth} ${end.getFullYear()}`;
    }, [weekDays]);

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    };
    
    const handleNextWeek = () => {
         setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    };
    
    const handleToday = () => {
        setCurrentDate(new Date());
    }

    const hours = Array.from({ length: 9 }, (_, i) => `${9 + i}:00`);
    const weekNumber = useMemo(() => {
        const d = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        const weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7);
        return weekNo;
    }, [currentDate]);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
    <div className="flex flex-col h-full bg-white">
        {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} onAddAppointment={handleAddAppointment} />}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border-r hover:bg-gray-50">Kalendere</button>
                    <button className="px-2 py-1.5 text-gray-700 hover:bg-gray-50 rounded-r-md">
                    <ChevronDownIcon />
                    </button>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={handlePrevWeek} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                    <ChevronLeftIcon />
                    </button>
                    <button onClick={handleNextWeek} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                    <ChevronRightIcon />
                    </button>
                </div>
                <button onClick={handleToday} className="px-3 py-1.5 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-50">i dag</button>
                <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-800">{weekLabel}</h2>
                    <button className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                        <ChevronDownIcon />
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                <DotsHorizontalIcon />
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon className="mr-2" />
                    Opret aftale
                </button>
            </div>
        </header>
        <div className="flex-grow flex overflow-auto">
            <div className="w-20 flex flex-col text-right pr-2 text-sm text-gray-500 sticky top-0 bg-white">
                <div className="h-10 flex items-end justify-end pb-1 font-medium">UGE {weekNumber}</div>
                {hours.map(hour => (
                <div key={hour} className="h-16 -mt-2.5">
                    <span>{hour}</span>
                </div>
                ))}
            </div>
            <div className="flex-grow grid grid-cols-7 border-l border-gray-200">
                {weekDays.map((day) => {
                    const dayAppointments = appointments.filter(app => app.date.toDateString() === day.toDateString());
                    return (
                        <div key={day.toISOString()} className={`border-r border-gray-200 ${isToday(day) ? 'bg-yellow-50' : ''}`}>
                            <div className="h-10 border-b border-gray-200 text-center text-sm font-medium text-gray-600 py-2 sticky top-0 bg-white z-10">
                                {day.toLocaleString('da-DK', { weekday: 'short' }).toUpperCase()} {day.getDate()}/{day.getMonth() + 1}
                            </div>
                            <div className="relative">
                                {hours.map((_, hourIndex) => (
                                    <div key={hourIndex} className="h-16 border-b border-gray-200"></div>
                                ))}
                                {dayAppointments.map(app => {
                                    const [hour, minute] = app.startTime.split(':').map(Number);
                                    const top = ((hour - 9) * 60 + minute) / 60 * 4; // 4rem per hour (h-16)
                                    const height = (app.duration / 60) * 4;

                                    return (
                                        <div
                                            key={app.id}
                                            className="absolute left-1 right-1 p-2 rounded-lg text-xs overflow-hidden"
                                            style={{
                                                top: `${top}rem`,
                                                height: `${height}rem`,
                                                backgroundColor: app.color,
                                                borderColor: '#93c5fd', // border-blue-300
                                                borderWidth: '1px',
                                            }}
                                        >
                                            <p className="font-semibold text-blue-900 truncate">{app.service}</p>
                                            <p className="text-blue-800 truncate">{app.client}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
    );
};

export default CalendarPage;