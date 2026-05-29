const Searchbar = (props) => {
    return (
        <>
            Search: <input
            value = {props.filterName}
            onChange={props.handleFilterChange}/>
        </>
        
    )
}

export default Searchbar