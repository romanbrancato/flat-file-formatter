import * as React from 'react';
import {Container} from "@/components/ui/container";

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 py-3 border-b backdrop-blur-xl mb-3 z-10">
            <Container>
                <h1>CSV Formatter</h1>
            </Container>
        </header>
    );
}

export { Header };