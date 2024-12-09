import React from 'react'

interface HeadingProps {
    title: string,
    desc: string,
    desc2?: string
}

const Heading: React.FC<HeadingProps> = ({ title, desc, desc2}) => {
    return (
        <div className="mb-6">
            <h2 className="text-4xl font-semibold mb-2 uppercase">{title}</h2>
            <p className="uppercase text-3xl font-semibold">
                GET points <span className="text-muted-foreground/35">{desc}</span>
                &nbsp;
                <br />
                {desc2}
            </p>
        </div>
    )
}

export default Heading