import { Link } from "react-router-dom";


const navLinks = [
    {
        title: "home",
        link: '/'
    }, {
        title: "listings",
        link: '/listings'
    }, {
        title: "find agent",
        link: '/'
    }, {
        title: "blog",
        link: '/'
    },
]

function NavList() {
    return (
        <>
            <ul className="hidden lg:flex items-center gap-4 list-none">
                {
                    navLinks.map((item, idx) => {
                        return (
                            <li className="text-xl font-Playfair font-medium capitalize" key={idx}>
                                <Link to={item.link}>
                                    <h5 className="text-(--primary-text) transition duration-300 ease-in-out hover:text-(--primary-color)">{item.title}</h5>
                                </Link>
                            </li>
                        )
                        
                    })
                }
            </ul>
        </>
    )
}

export default NavList;