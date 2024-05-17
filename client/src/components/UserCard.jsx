export function UserCard( {user} ) {
    return (
        <div>
            <hr />
            <h1>{user.id}</h1>
            <p>{user.dni}</p>
            <hr />
        </div>
    )
}