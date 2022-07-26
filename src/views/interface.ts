interface AuthData {
    token: string;
    user_name: string;
    user_address: string;
}

interface BaseConfig {
    chainId: number;
    network: string;
}

interface NetworkOptions {
    value: string;
    label: string;
}

interface UserLoginRequest {
    address: string;
    sign: string;
    sign_content: string;
}

interface ShardSummary {
    consensus: boolean;
    blocksToNextEpoch: number;
    blockMax: number;
    blockMin: number;
    epochMax: number;
    epochMin: number;
    pendingCrossLinksCount: number;
    pendingCxCount: number;
    leader: string;
    signPower: string;
    uniqBlocks: number[];
    uniqEpochs: number[];
    nodeCount: number;
    lastCrosslink: number;
}

interface ShardConfig {
    chainId: string;
    crossLinkEpoch: string;
    crossTxEpoch: string;
    eip155Epoch: string;
    s3Epoch: string;
    preStakingEpoch: string;
    stakingEpoch: string;
    blocksPerEpoch: string;
    dNSZone: string;
}

interface VersionSummary {
    title: string;
    nodeCount: number;
}

interface NoReplyMachine {
    ip: string;
    failureReason: string;
    rpcPayload: string;
    shardID: number;
}

interface ShardBlockHeader {
    shardID: number;
    validators: NodeBlockHeader[];
    explorers: NodeBlockHeader[];
}

interface NodeBlockHeader {
    payload: NodeBlockHeaderPayload;
    ip: string;
}

interface NodeBlockHeaderPayload {
    blockHash: string;
    blockNumber: number;
    shardID: number;
    leader: string;
    viewID: number;
    epoch: number;
    timestamp: string;
    unixtime: number;
    lastCommitSig: string;
    lastCommitBitmap: string;
    BeaconChainBlock: number;
    NodeProvider: string;
    NodeType: string;
}

interface VersionNodeMetadata {
    payload: VersionNodeMetadataPayload;
    ip: string;
}

interface VersionNodeMetadataPayload {
    blsKey: string[];
    shortBlsKey: string[];
    role: string;
    archive: boolean;
    nodeUnixStartTime: number;
    nodeStartTime: string;
    peerId: string;
    shardId: number;
    p2pConnectivity: VersionNodeMetadataPayloadP2pConnectivity;
    consensus: VersionNodeMetadataPayloadConsensus;
    syncStatus: string;
}

interface VersionNodeMetadataPayloadConsensus {
    viewId: number;
    viewChangeId: number;
    mode: string;
    phase: string;
    blocknum: number;
    finality: number;
}

interface VersionNodeMetadataPayloadP2pConnectivity {
    connected: number;
    totalKnownPeers: number;
    connectivity: number;
}

interface SuperCommitteeQuorumDecider {
    shardId: number;
    policy: string;
    count: number;
    externalValidatorSlotCount: number;
    CommitteeMembers: QuorumDeciderCommitteeMember[];
    hmyVotingPower: string;
    stakedVotingPower: string;
    totalRawStaked: string;
}

interface QuorumDeciderCommitteeMember {
    earningAccount: string;
    isHarmonySlot: boolean;
    blsPublicKey: string;
    votingPowerUnnormalized: string;
    votingPower: string;
    effectiveStake: string;
}