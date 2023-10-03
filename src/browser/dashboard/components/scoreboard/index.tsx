import {FC, useState} from "react";
import { TextField, Button, Stack, Box, Alert, Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Update as UpdateIcon } from '@mui/icons-material'; // アイコンのインポート
import DataObjectIcon from '@mui/icons-material/DataObject';
// import { useReplicant } from "../../../use-replicant";
import { fetchDataFromAPI,transformApiResponseToScoreboard } from '../../libs/apiFunctions';
import { getStreamQueue } from '../../libs/getStreamQueue'
import { Scoreboard } from "../../../../nodecg/generated/scoreboard";


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
    }
    
    const handleGetStreamQueue = async () => {
        try {
            const result = await getStreamQueue(url);
            setStreamQueue(result.sort((a, b) => b.id - a.id)); 
            // console.log(result); // 戻り値をコンソールに表示
        } catch (error) {
            console.error("getStreamQueue failed:", error);
        }
    }
    
    const handleRowClick = (row: any) => {
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
    };


    return (
        <Stack spacing={2} direction='row'>
            <Box sx={{ p: 2 }}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <Stack spacing={3}>

                    {/* Roundの配置 */}
                    <Stack spacing={2} direction='row'>
                        <TextField 
                            id="fullRoundText" 
                            label="fullRoundText" 
                            variant="outlined" 
                            value={scoreboard_input.fullRoundText} 
                            onChange={(e)=>{setscoreboard_input(prev => ({...prev, fullRoundText: e.target.value}))}}
                        />
                        <TextField 
                            id="url" 
                            label="url" 
                            variant="outlined" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)} // URLの状態を更新
                        />
                    </Stack>

                    <Stack spacing={2} direction='row'>
                        <Stack spacing={1}>
                        {/* 1Pのフィールド */}
                        <TextField 
                            id="player1_prefix" 
                            label="player1_prefix" 
                            variant="outlined" 
                            value={scoreboard_input.player1.prefix} 
                            onChange={(e) => {
                                setscoreboard_input(prev => ({
                                    ...prev,
                                    player1: {
                                        ...prev.player1,
                                        prefix: e.target.value
                                    }
                                }))
                            }}
                        />
                            <TextField 
                                id="player1_name" 
                                label="player1_name" 
                                variant="outlined" 
                                value={scoreboard_input.player1.name} 
                                onChange={(e)=>{
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            name: e.target.value
                                        }
                                    }))
                                }}
                            />
                            <TextField 
                                id="player1_Xid" 
                                label="player1_Xid" 
                                variant="outlined" 
                                value={scoreboard_input.player1.xID} 
                                onChange={(e)=>{
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            Xid: e.target.value
                                        }
                                    }))
                                }}
                            />
                            <TextField 
                                id="player1_score" 
                                type="number" 
                                label="player1_score" 
                                variant="outlined" 
                                value={scoreboard_input.player1.score} 
                                onChange={(e) => {
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            score: Number(e.target.value)
                                        }
                                    }))
                                }}
                            />
                        </Stack>

                        {/* 2Pのフィールド */}
                        <Stack spacing={1}>
                            <TextField 
                                id="player2_prefix" 
                                label="player2_prefix" 
                                variant="outlined" 
                                value={scoreboard_input.player2.prefix} 
                                onChange={(e)=>{
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            name: e.target.value
                                        }
                                    }))
                                }}
                            />
                            <TextField 
                                id="player2_name" 
                                label="player2_name" 
                                variant="outlined" 
                                value={scoreboard_input.player2.name} 
                                onChange={(e)=>{
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            name: e.target.value
                                        }
                                    }))
                                }}
                            />
                                <TextField 
                                id="player2_Xid" 
                                label="player2_Xid" 
                                variant="outlined" 
                                value={scoreboard_input.player1.xID} 
                                onChange={(e)=>{
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            name: e.target.value
                                        }
                                    }))
                                }}
                            />
                            <TextField 
                                id="player2_score" 
                                type="number" 
                                label="player2_score" 
                                variant="outlined" 
                                value={scoreboard_input.player1.score} 
                                onChange={(e) => {
                                    setscoreboard_input(prev => ({
                                        ...prev,
                                        player1: {
                                            ...prev.player1,
                                            score: Number(e.target.value)
                                        }
                                    }))
                                }}
                            />
                        </Stack>
                    </Stack>

                    {/* UPDATEボタン */}
                    <Stack spacing={2} direction='row'>
                        <Button 
                            variant="contained" 
                            onClick={handleGetStreamQueue}
                        >
                            getStreamQueue
                        </Button>
                        <Button 
                        variant="contained" 
                        startIcon={<DataObjectIcon />} 
                        onClick={handleFetchData}>_API
                        </Button>
                        <Button 
                        variant="contained" 
                        startIcon={<UpdateIcon />} 
                        onClick={() => updateScoreboard(scoreboard_input)}>Update
                        </Button>
                    </Stack>
            
                </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Round Text</TableCell>
                                <TableCell>Player 1</TableCell>
                                <TableCell>Player 2</TableCell>
                                <TableCell>Stream Name</TableCell>
                                <TableCell>State</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {streamQueue.map((row) => (
                                <TableRow key={row.id} onClick={() => handleRowClick(row)}>
                                    <TableCell>{row.roundText}</TableCell>
                                    <TableCell>{row.p1.playerName}</TableCell>
                                    <TableCell>{row.p2.playerName}</TableCell>
                                    <TableCell>{row.streamName}</TableCell>
                                    <TableCell>{row.state}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            
        </Stack>
        
    );
};
