const DatesMatrix = ({ dates, currentDay , selectedDay ,onSelect }) => {
    return (
        <div className="flex2">
            {dates.map((date, index) => (
                <div key={date} className="flex" >
                    {date.map((day) => (
                        <div style={{width:'5vw',height:'5vh',borderBottom:selectedDay===day?'4px solid rgba(255, 0, 0, 0.5)':'none',borderRadius:selectedDay===day?'none':'2vh',padding:'1vh', textAlign:'center' ,cursor:'pointer', backgroundColor: day === currentDay ? 'rgba(255, 0, 0, 0.5)' : 'inherit'}}
                        onClick={() => {onSelect(day)}} 
                        key={Math.random()}>{day}</div>
                    ))}
                </div>
            ))}
        </div>
    );
};
export default DatesMatrix;