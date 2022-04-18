export const getCouplingConstant = (magnetism: string) => {
    if (magnetism! == "Ferromagnetic") {
        return 1;
    } else {
        return -1;
    }
}