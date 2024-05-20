import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {useContext, useState} from "react";
import {Preset} from "@/types/preset";
import {DataContext} from "@/context/data-context";

export function PresetSelector() {
    const {initialFields, removeField, addField, editField, arrangeFields} = useContext(DataContext)
    const [open, setOpen] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<Preset>()

    const presets: Preset[] = [
        {
            name: "Default CSV",
            initial: initialFields,
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter', 'ClientIDExpanded', 'GroupNumber', 'MemberID', 'CardholderID', 'PersonCode', 'PatientFirstName', 'PatientLastName', 'DateofBirth', 'Sex', 'DateFilledFull', 'DateSubmitted', 'DateRxWrittenFull', 'DMR', 'PharmacyNumber', 'PrescriptionNumber', 'SubmittedMetricQuantity', 'SubmittedDaysSupply', 'NDCNumber', 'GPI', 'SubmittedDAW', 'ProductName', 'MultisourceCode', 'FormularyIndicator', 'CustomerCalculatedIngredientCost', 'ApprovedDispensingFee', 'ApprovedSalesTax', 'ApprovedCopay', 'TotalPlanAmtDue', 'RefillsAuthorized', 'RefillNumber', 'CompoundCode', 'PrescriberID', 'AmountAppliedtoPeriodDeductible', 'AmountAppliedtoPeriodMax', 'AmountAppliedtoPeriodMOP', 'PharmacyName', 'PharmacyChainName', 'PharmacyChainID', 'PharmacyStoreNumber', 'PharmacyAddress1', 'PharmacyAddress2', 'PharmacyCity', 'PharmacyState', 'PharmacyZipcode', 'PharmacyPhoneNumber', 'PrescriberFirstName', 'PrescriberLastName', 'PrescriberAddress1', 'PrescriberAddress2', 'PrescriberCity', 'PrescriberState', 'PrescriberZipcode', 'MaintenanceDrugIndicator', 'MemberRelationShip', 'ClaimReferenceNumber', 'PrescriptionOrigin', 'PharmacyNPIID', 'RxOTCIndicatorCode', 'AWPAmount', 'AdminFee', 'ClientPriceType', 'PriorAuthorizationID', 'AHFSCode', 'DrugDEAClassCode', 'PrescriberNPI', 'SpecialtyFlag', 'MemberZip', 'PaidCopay', 'PaidCoinsurance', 'PlanID', 'SecondaryAssistanceProgram', 'Drug Tier'],
            export: "csv",
            widths: null,
            symbol: ","
        }
    ]

    async function onPresetSelect(preset: Preset) {
        if (preset.removed) {
            preset.removed.forEach(field => removeField(field))
        }
        if (preset.added) {
            preset.added.forEach(({field, value}) => addField(field, value))
        }
        if (preset.edited) {
            preset.edited.forEach(({field, value}) => editField(field, value))
        }
        if (preset.order) {
            arrangeFields(preset.order)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={open}
                    className="flex-1 justify-between min-w-[100px] sm:min-w-[300px]"
                >
                    {selectedPreset ? selectedPreset.name : "Load a preset..."}
                    <CaretSortIcon className="ml-2 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search presets..."/>
                    <CommandGroup heading="Presets">
                        {presets.map((preset, index) => (
                            <CommandItem
                                key={index}
                                onSelect={() => {
                                    onPresetSelect(preset)
                                    setSelectedPreset(preset)
                                    setOpen(false)
                                }}
                            >
                                {preset.name}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto",
                                        selectedPreset === preset
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No presets found.</CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    )
}