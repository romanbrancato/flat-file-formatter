import * as React from 'react';
import {Container} from "@/components/ui/container";

const Header: React.FC = () => {
    return (
        <header className="py-3 mb-3 z-10">
            <Container>
                <h1>CSV FORMATTER</h1>
            </Container>
        </header>
    );
}

export { Header };