import * as React from 'react';
import {Container} from "@/components/ui/container";

const Header: React.FC = () => {
    return (
        <header className="py-3 mb-3 z-10">
            <Container>
                <div className="text-md font-medium peer-disabled:cursor-not-allowed mb-1">
                    .csv Formatter
                </div>
            </Container>
        </header>
    );
}

export {Header};