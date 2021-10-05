import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Pokemon, getAll, getByName } from "./API";

import "./styles.css";

interface PokemonWithPower extends Pokemon {
    power: number;
}

const calculatePower = (pokemon: Pokemon) =>
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.special_attack +
    pokemon.special_defense +
    pokemon.speed;

let tableRender = 0;
const PokemonTable: React.FunctionComponent<{
    pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
    console.log(`table render = ${tableRender++}`);

    return (
        <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Type</td>
                    <td colSpan={6}>Stats</td>
                    <td>Power</td>
                </tr>
            </thead>
            <tbody>
                {pokemon.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.type.join(",")}</td>
                        <td>{p.hp}</td>
                        <td>{p.attack}</td>
                        <td>{p.defense}</td>
                        <td>{p.special_attack}</td>
                        <td>{p.special_defense}</td>
                        <td>{p.speed}</td>
                        <td>{p.power}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const MemoedPokemonTable = React.memo(PokemonTable);

let appRender = 0;
export default function App() {
    console.log(`appRender = ${appRender++}`);
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getByName(search).then(setPokemon);
    }, [search]);

    const pokemonWithPower = useMemo(
        () =>
            pokemon.map((p) => ({
                ...p,
                power: calculatePower(p),
            })),
        [pokemon]
    );

    const [threshold, setThreshold] = useState(0);

    const onSetThreshold = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setThreshold(parseFloat(e.target.value)),

        []
    );

    const onSetSearch = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const countOverThreshold = useMemo(
        () => pokemonWithPower.filter((p) => p.power > threshold).length,
        [threshold, pokemonWithPower]
    );

    const min = useMemo(() => {
        return Math.min(...pokemonWithPower.map((p) => p.power));
    }, [pokemonWithPower]);

    const max = useMemo(() => {
        return Math.max(...pokemonWithPower.map((p) => p.power));
    }, [pokemonWithPower]);

    return (
        <div>
            <div className="top-bar">
                <div>Search</div>
                <input
                    type="text"
                    value={search}
                    onChange={onSetSearch}
                ></input>
                <div>Power threshold</div>
                <input
                    type="integer"
                    value={threshold}
                    onChange={onSetThreshold}
                ></input>
                <div>Count over threshold: {countOverThreshold}</div>
            </div>
            <div className="two-column">
                <MemoedPokemonTable pokemon={pokemonWithPower} />
                <div>
                    <div>Min: {min}</div>
                    <div>Max: {max}</div>
                </div>
            </div>
        </div>
    );
}
