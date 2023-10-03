import {FC, useState} from "react";
import { Alert, Stack } from "@mui/material";
// import { Update as UpdateIcon } from '@mui/icons-material'; // アイコンのインポート
// import DataObjectIcon from '@mui/icons-material/DataObject';

import { fetchDataFromAPI, transformApiResponseToScoreboard } from '../libs/apiFunctions';
import { getStreamQueue } from '../libs/getStreamQueue'
import { getPlayerData } from '../libs/getPlayerData'
import { getBracket } from '../libs/getBracket'
import { Scoreboard } from "../../../nodecg/generated/scoreboard";

import ScoreboardInput from './scoreboard/ScoreboardInput';
import StreamQueueTable from './scoreboard/StreamQueueTable';

export const Sample: FC = () => {
    const [scoreboard_input, setscoreboard_input] = useState<Scoreboard>({
        player1: {
            name: 'Player1',
            prefix: 'Team',
            xID: '@',
            score: 0
        },
        player2: {
            name: 'Player2',
            prefix: 'Team',
            xID: '@',
            score: 0
        },
        fullRoundText: ''
	});

    const [url, setUrl] = useState('https://www.start.gg/tournament/api-test-1/event/special-1on1-ultimate-singles/brackets/1456184/2204751'); // 2. URLの状態を管理
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [streamQueue, setStreamQueue] = useState<any[]>([]); 
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const bracketRep = nodecg.Replicant("bracket");
    console.log('bracketRep',bracketRep)

    const updateScoreboard = (scoreboard_input:Scoreboard) => {
		nodecg.sendMessage("scoreboard:update", scoreboard_input)
    }

    const handleFetchData = async () => {
        const data = await fetchDataFromAPI();

        if (data) {
            const newScoreboard = transformApiResponseToScoreboard(data);
    
            if ('error' in newScoreboard) {
                // エラーメッセージを設定
                setErrorMessage(newScoreboard.message);
            } else {
                // Scoreboardデータを更新
                setscoreboard_input(newScoreboard);
                // エラーメッセージをクリア
                setErrorMessage(null);
            }
        } else {
            // APIからのデータがない場合のエラーメッセージ
            setErrorMessage("APIからのデータが取得できませんでした。");
        }
        // const ID = 64727139
        // const playerData = getPlayerData(ID)
        // console.log('playerData',JSON.stringify(playerData, null, 2));
        const bracketData = await getBracket(url);
        console.log('bracketData',JSON.stringify(bracketData, null, 2));
        bracketRep.value = bracketData;
        console.log('bracketRep.value',JSON.stringify(bracketRep.value, null, 2));
    }
    
    const handleGetStreamQueue = async () => {
        try {
            const result = await getStreamQueue(url);
            setStreamQueue(result.sort((a, b) => b.id - a.id)); 
            console.log('result',JSON.stringify(result, null, 2));
        } catch (error) {
            console.error("getStreamQueue failed:", error);
        }
    }
    
    const handleRowClick = async (row: any) => {
        // こちらは仮のデータマッピングです。実際のデータ構造に合わせて調整が必要かもしれません。
        setscoreboard_input(prev => ({
            ...prev,
            player1: {
                name: row.p1.playerName,
                prefix: row.p1.team || "",  // こちらも適切なフィールド名に変更してください
                xID: row.p1.xID || "@",  // TwitterIDがxIDに変更されたとのこと
                score: row.p1.score || 0
            },
            player2: {
                name: row.p2.playerName,
                prefix: row.p2.team || "",  // こちらも適切なフィールド名に変更してください
                xID: row.p2.xID || "@",  // TwitterIDがxIDに変更されたとのこと
                score: row.p2.score || 0
            },
            fullRoundText: row.roundText
        }));

        // クリックされた行のIDでgetPlayerDataを呼び出す
        const playerData = await getPlayerData(row.id);
        console.log('playerData',JSON.stringify(playerData, null, 2));
    };

    return (
        <Stack spacing={2} direction='row'>
            <ScoreboardInput 
                scoreboard_input={scoreboard_input} 
                setscoreboard_input={setscoreboard_input} 
                url={url}
                setUrl={setUrl}
                handleGetStreamQueue={handleGetStreamQueue}
                handleFetchData={handleFetchData}
                updateScoreboard={updateScoreboard}
                errorMessage={errorMessage}  // この行を追加
            />
            
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <StreamQueueTable 
                streamQueue={streamQueue} 
                selectedRowId={selectedRowId} 
                handleRowClick={handleRowClick} 
                setSelectedRowId={setSelectedRowId}
            />
            
        </Stack>
    );
};

export default Sample;
