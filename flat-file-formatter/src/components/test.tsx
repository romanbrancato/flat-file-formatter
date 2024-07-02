import {useContext} from "react";
import {ParserContext} from "@/context/parser-context";

export function Test() {
    const {setParams, isReady, data} = useContext(ParserContext);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setParams({
            file,
            format: "fixed",
            config: {
                fields: [
                    {property: "ClaimCounter", width: 20},
                    {property: "ClaimType", width: 20},
                    {property: "PharmacyStatusCode", width: 20},
                    {property: "BINNumber", width: 20},
                    {property: "ClientIDExpanded", width: 20},
                    {property: "GroupNumber", width: 20},
                    {property: "MemberID", width: 20},
                    {property: "CardholderID", width: 20},
                    {property: "PersonCode", width: 20}
                ]
            }
        });
    }

    return (
        <>
            <input type="file" onChange={onChange}/>
            <div>{isReady ? "Ready" : "Not ready"}</div>
            <div>{JSON.stringify(data, null, 2)}</div>
        </>
    );
}
