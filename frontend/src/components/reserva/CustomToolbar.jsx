/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

const CustomToolbar = (toolbar) => {
    const [navSelected, setNavSelected] = useState(() => {
        const isToday = toolbar.date.toDateString() === new Date().toDateString()
        return isToday ? 'TODAY' : null
    })
    const [viewSelected, setViewSelected] = useState(toolbar.view)

    const handleNav = (type) => {
        setNavSelected(type)
        toolbar.onNavigate(type)
    }

    const changeView = (view) => {
        setViewSelected(view)
        toolbar.onView(view)
    }

    useEffect(() => {
        if (toolbar.date.toDateString() === new Date().toDateString()) {
            setNavSelected('TODAY')
        } else if (navSelected === 'TODAY') {
            setNavSelected(null)
        }
    }, [])

    return (
        <div className="rbc-toolbar d-flex justify-content-between align-items-center">
            <div className="rbc-btn-group">
                <button
                    type="button"
                    onClick={() => handleNav('PREV')}
                    className={navSelected === 'PREV' ? 'active' : ''}
                >
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={() => handleNav('TODAY')}
                    className={navSelected === 'TODAY' ? 'active' : ''}
                >
                    Hoy
                </button>
                <button
                    type="button"
                    onClick={() => handleNav('NEXT')}
                    className={navSelected === 'NEXT' ? 'active' : ''}
                >
                    Siguiente
                </button>
            </div>

            <div className="rbc-toolbar-label mt-2 mb-2 text-center">
                <strong>{toolbar.label}</strong>
            </div>

            <div className="rbc-btn-group">
                {['month', 'week', 'day', 'agenda'].map((view) => (
                    <button
                        key={view}
                        type="button"
                        onClick={() => changeView(view)}
                        className={viewSelected === view ? 'active' : ''}
                    >
                        {view === 'month'
                            ? 'Mes'
                            : view === 'week'
                                ? 'Semana'
                                : view === 'day'
                                    ? 'Día'
                                    : 'Agenda'}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CustomToolbar
