import styles from "./Testimonials.module.css"

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Interior Designer",
        image: "/placeholder.svg?height=100&width=100",
        content:
            "The quality of these bedsheets is exceptional. My clients are always impressed when I recommend CozyHome products for their bedrooms. The attention to detail and craftsmanship is unmatched.",
        rating: 5,
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Homeowner",
        image: "/placeholder.svg?height=100&width=100",
        content:
            "I've tried many brands of towels, but these are by far the softest and most absorbent. They still look and feel brand new even after multiple washes. Definitely worth the investment!",
        rating: 5,
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Hotel Manager",
        image: "/placeholder.svg?height=100&width=100",
        content:
            "We've switched all our hotel rooms to use CozyHome bedding and towels. Our guests frequently comment on how comfortable they are, and the durability means they're cost-effective for our business.",
        rating: 4,
    },
]

export default function Testimonials() {
    return (
        <section className={styles.testimonials}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>What Our Customers Say</h2>
                    <p className={styles.subtitle}>Don't just take our word for it - hear from our satisfied customers</p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className={styles.testimonial}>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={i < testimonial.rating ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={styles.star}
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </div>
                            <p className={styles.content}>{testimonial.content}</p>
                            <div className={styles.author}>
                                <img
                                    src={testimonial.image || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    className={styles.authorImage}
                                />
                                <div className={styles.authorInfo}>
                                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                                    <p className={styles.authorRole}>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

