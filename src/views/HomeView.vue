<template>
  <div class="home">
    <header id="top-of-page">
      <div class="build-stat">
        <div class="flex-row space-between">
          <div class="flex-col">
            <el-select v-model="baseConfig.network" placeholder="select network" @change="changeNetwork">
              <el-option
                  v-for="item in networkOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="flex-col" style="padding-top: 10px;">
            <span class="build-stat-values">{{ versionTitle }}</span>
          </div>
          <template v-if="userToken !== ''">
            <div class="flex-col">
              <div class="flex-row">
                <span class="title-username">{{ userName }}</span>
                <el-button type="danger" icon="el-icon-lock" @click="userLogout">Logout</el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <hr/>
      <template v-if="userToken !== ''">
        <div class="build-stat flex-both">
          <div class="flex-col center stat-box" v-for="(summary, shardId) in shardSummarySet" :key="shardId">
            <el-link class="link-anchor" @click.prevent="anchor('validator-shard-'+shardId)">Shard-{{
                shardId
              }}
            </el-link>
            <p><span>Consensus:</span><span>{{ summary.consensus }}</span></p>
            <p><span>Chain ID:</span><span>{{ shardConfigSet[shardId].chainId }}</span></p>
            <p><span>Cross Link Epoch:</span><span>{{ shardConfigSet[shardId].crossLinkEpoch }}</span></p>
            <p><span>Cross Tx Epoch:</span><span>{{ shardConfigSet[shardId].crossTxEpoch }}</span></p>
            <p><span>Eip155 Epoch:</span><span>{{ shardConfigSet[shardId].eip155Epoch }}</span></p>
            <p><span>S3 Epoch:</span><span>{{ shardConfigSet[shardId].s3Epoch }}</span></p>
            <p><span>Pre-Staking Epoch:</span><span>{{ shardConfigSet[shardId].preStakingEpoch }}</span></p>
            <p><span>Staking Epoch:</span><span>{{ shardConfigSet[shardId].stakingEpoch }}</span></p>
            <p><span>Blocks Per Epoch:</span><span>{{ shardConfigSet[shardId].blocksPerEpoch }}</span></p>
            <p><span>DNS Zone:</span><span>{{ shardConfigSet[shardId].dNSZone }}</span></p>
            <p v-if="shardId === 0"><span>Blocks To Next Epoch:</span><span>{{ summary.blocksToNextEpoch }}</span></p>
            <p v-else><span>Blocks To Next Epoch:</span><span>-</span></p>
            <p><span>Last Crosslink:</span><span>last-crosslink</span></p>
            <el-link class="link-anchor" @click.prevent="anchor('current-committee-'+shardId)">
              <span>{{ superCommitteeCurrentSet[shardId].externalValidatorSlotCount }}</span> Current Committee
            </el-link>
            <el-link class="link-anchor" @click.prevent="anchor('previous-committee-'+shardId)">
              <span>{{ superCommitteePreviousSet[shardId].externalValidatorSlotCount }}</span> Previous Committee
            </el-link>
          </div>
        </div>
        <div class="build-stat flex-both">
          <div class="flex-col center stat-box" v-for="(summary, shardId) in shardSummarySet" :key="shardId">
            <el-link class="link-anchor" @click.prevent="anchor('validator-shard-'+shardId)">Shard-{{
                shardId
              }}
            </el-link>
            <p><span>Node Count:</span><span>{{ summary.nodeCount }}</span></p>
            <p><span>Max Block:</span><span>{{ summary.blockMax }}</span></p>
            <p><span>Max Epoch:</span><span>{{ summary.epochMax }}</span></p>
            <p><span>Sign Power:</span><span>{{ summary.signPower }}</span></p>
            <p><span>Pending CX Receipts:</span><span>{{ summary.pendingCxCount }}</span></p>
            <p><span>Pending CrossLinks:</span><span>{{ summary.pendingCrossLinksCount }}</span></p>
            <p><span>Leader:</span><span>{{ summary.leader }}</span></p>
          </div>
        </div>
        <div class="build-stat flex-both">
          <div class="flex-col center stat-box" v-for="summary in versionSummarySet" :key="summary.title">
            <el-link class="link-anchor" @click.prevent="anchor('version-'+summary.title)">{{ summary.title }}</el-link>
            <p>
              Node Count: {{ summary.nodeCount }}
              <a href="https://github.com/harmony-one/harmony/commit/0" v-show="false">commit</a>
            </p>
          </div>
        </div>
      </template>
    </header>
    <main v-if="userToken !== ''">
      <section class="report-wrapper" v-if="noReplyMachineSet.length > 0">
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row space-between">
              <h3>
                Down machines <span><el-link class="link-anchor" @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
              <p style="width: 375px;">
                Note: "dialing to the given TCP address timed out" failure could
                just mean that the HTTP RPC did not complete fast enough.
              </p>
            </div>
            <div class="flex-row">
              <p>Distinct down machine count: {{ noReplyMachineSet.length }}</p>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th>IP</th>
            <th>Intended ShardID</th>
            <th>RPC Payload</th>
            <th>Failure Reason</th>
          </tr>
          </thead>
          <tbody>
          <tr style="background-color:#F0B4B4;" v-for="(machine, index) in noReplyMachineSet" :key="index">
            <td>{{ machine.ip }}</td>
            <td>{{ machine.shardID }}</td>
            <td>{{ machine.rpcPayload }}</td>
            <td>{{ machine.failureReason }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="report-wrapper" :id="'validator-shard-'+shardId" v-for="(summary, shardId) in shardSummarySet"
               :key="'validator-'+shardId">
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row" style="margin-bottom: 10px;">
              <h3>
                Validator Node Block Header <span><el-link class="link-anchor" @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
              <el-button
                  type="primary"
                  size="mini"
                  @click="downloadCSV('/api/report-download-'+network+'?report=block-header&shard='+shardId)"
              >Download CSV
              </el-button>
            </div>
            <div class="flex-row">
              <p>Shard: {{ shardId }}</p>
              <p>Nodes: {{ summary.nodeCount }}</p>
              <p>Max Block: {{ summary.blockMax }}</p>
              <p>Min Block: {{ summary.blockMin }}</p>
              <p>Max Epoch: {{ summary.epochMax }}</p>
              <p>Min Epoch: {{ summary.epochMin }}</p>
            </div>
            <div class="flex-row">
              <p>Unique Blocks: [{{ summary.uniqBlocks.join(' ') }}]</p>
              <p>Unique Epochs: [{{ summary.uniqEpochs.join(' ') }}]</p>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th width="100px">IP</th>
            <th width="120px">Node<br>Provider</th>
            <th width="105px">Node<br>Type</th>
            <th width="200px">Block Hash</th>
            <th width="60px">Epoch</th>
            <th width="100px">Block<br>Number</th>
            <th class="th-blocks-behind" data-sortable-type="numeric" width="100px">Blocks<br>Behind<br>Max</th>
            <th width="120px">Beacon Chain<br>Block Number</th>
            <th width="160px">Leader</th>
            <th width="100px">ViewID</th>
            <th width="50px">Timestamp</th>
            <th width="60px">Last<br>Commit<br>Signature</th>
            <th width="100px">Last<br>Commit<br>Bitmap</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(record, index) in shardBlockHeaderSet[shardId].validators" :key="index">
            <td>{{ record.ip }}</td>
            <td>{{ record.payload.NodeProvider }}</td>
            <td>{{ record.payload.NodeType }}</td>
            <td>{{ record.payload.blockHash }}</td>
            <td>{{ record.payload.epoch }}</td>
            <td>{{ record.payload.blockNumber }}</td>
            <td>{{ summary.blockMax - record.payload.blockNumber }}</td>
            <td>{{ record.payload.BeaconChainBlock }}</td>
            <td>{{ record.payload.leader }}</td>
            <td>{{ record.payload.viewID }}</td>
            <td>{{ record.payload.timestamp }}</td>
            <td>{{ record.payload.lastCommitSig }}</td>
            <td>{{ record.payload.lastCommitBitmap }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="report-wrapper" :id="'explorer-shard-'+shardId" v-for="(summary, shardId) in shardSummarySet"
               :key="'explorer-'+shardId">
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row" style="margin-bottom: 10px;">
              <h3>
                Explorer Node Block Header <span><el-link class="link-anchor" @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
              <el-button
                  type="primary"
                  size="mini"
                  @click="downloadCSV('/api/report-download-'+network+'?report=block-header&shard='+shardId)"
              >Download CSV
              </el-button>
            </div>
            <div class="flex-row">
              <p>Shard: {{ shardId }}</p>
              <p>Nodes: {{ summary.nodeCount }}</p>
              <p>Max Block: {{ summary.blockMax }}</p>
              <p>Min Block: {{ summary.blockMin }}</p>
              <p>Max Epoch: {{ summary.epochMax }}</p>
              <p>Min Epoch: {{ summary.epochMin }}</p>
            </div>
            <div class="flex-row">
              <p>Unique Blocks: [{{ summary.uniqBlocks.join(' ') }}]</p>
              <p>Unique Epochs: [{{ summary.uniqEpochs.join(' ') }}]</p>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th width="100px">IP</th>
            <th width="120px">Node<br>Provider</th>
            <th width="105px">Node<br>Type</th>
            <th width="200px">Block Hash</th>
            <th width="60px">Epoch</th>
            <th width="100px">Block<br>Number</th>
            <th class="th-blocks-behind" data-sortable-type="numeric" width="100px">Blocks<br>Behind<br>Max</th>
            <th width="120px">Beacon Chain<br>Block Number</th>
            <th width="160px">Leader</th>
            <th width="100px">ViewID</th>
            <th width="50px">Timestamp</th>
            <th width="60px">Last<br>Commit<br>Signature</th>
            <th width="100px">Last<br>Commit<br>Bitmap</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(record, index) in shardBlockHeaderSet[shardId].explorers" :key="index">
            <td>{{ record.ip }}</td>
            <td>{{ record.payload.NodeProvider }}</td>
            <td>{{ record.payload.NodeType }}</td>
            <td>{{ record.payload.blockHash }}</td>
            <td>{{ record.payload.epoch }}</td>
            <td>{{ record.payload.blockNumber }}</td>
            <td>{{ summary.blockMax - record.payload.blockNumber }}</td>
            <td>{{ record.payload.BeaconChainBlock }}</td>
            <td>{{ record.payload.leader }}</td>
            <td>{{ record.payload.viewID }}</td>
            <td>{{ record.payload.timestamp }}</td>
            <td>{{ record.payload.lastCommitSig }}</td>
            <td>{{ record.payload.lastCommitBitmap }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="report-wrapper" :id="'version-'+version" v-for="(records, version) in versionNodeMetadataSet"
               :key="version">
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row" style="margin-bottom: 10px;">
              <h3>
                Node Metadata <span><el-link class="link-anchor" @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
              <el-button
                  type="primary"
                  size="mini"
                  @click="downloadCSV('/api/report-download-'+network+'?report=node-metadata&vrs='+version)"
              >Download CSV
              </el-button>
            </div>
            <div class="flex-row">
              <p>Build Version: {{ version }}</p>
              <p>Nodes: {{ records.length }}</p>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th>IP</th>
            <th>PeerID</th>
            <th>BLSKey</th>
            <th>ChainID</th>
            <th>ShardID</th>
            <th>Role</th>
            <th>Archival</th>
            <th>Sync<br>Status</th>
            <th>Total<br>Peers</th>
            <th>Connectivity</th>
            <th>Start</th>
            <th>Mode</th>
            <th>Phase</th>
            <th>Block<br>ViewID</th>
            <th>ViewChange<br>ID</th>
            <th>Block<br>Number</th>
            <th>Finality<br>(ms)</th>
          </tr>
          </thead>
          <tbody>
          <tr class="IsLeader-is-leader-end" v-for="(record, index) in records" :key="version+'-'+index">
            <td>{{ record.ip }}</td>
            <td>{{ record.payload.peerId }}</td>
            <td>{{ record.payload.shortBlsKey.join(',') }}</td>
            <td>{{ baseConfig.chainId }}</td>
            <td>{{ record.payload.shardId }}</td>
            <td>{{ record.payload.role }}</td>
            <td>{{ record.payload.archive }}</td>
            <td>{{ record.payload.syncStatus }}</td>
            <td>{{ record.payload.p2pConnectivity.totalKnownPeers }}</td>
            <td>{{ record.payload.p2pConnectivity.connectivity + '%' }}</td>
            <td>{{ record.payload.nodeStartTime }}</td>
            <td>{{ record.payload.consensus.mode }}</td>
            <td>{{ record.payload.consensus.phase }}</td>
            <td>{{ record.payload.consensus.viewId }}</td>
            <td>{{ record.payload.consensus.viewChangeId }}</td>
            <td>{{ record.payload.consensus.blocknum }}</td>
            <td>{{ record.payload.consensus.finality }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="report-wrapper" :id="'current-committee-'+shardId"
               v-for="(committees, shardId) in superCommitteeCurrentSet" :key="'current-'+shardId">
        <input type="checkbox" :id="'curr-hn-toggle-'+shardId">
        <label :id="'curr-hn-toggle-'+shardId">show harmony nodes</label>
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row">
              <h3>
                Shard {{ shardId }} Current Committee <span><el-link class="link-anchor"
                                                                     @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
            </div>
            <div class="flex-row">
              <div class="flex-col">
                <p>Policy: {{ committees.policy }}</p>
                <p>Members: {{ committees.count }}</p>
              </div>
              <div class="flex-col">
                <p>Internal Vote Power: {{ committees.hmyVotingPower }}</p>
                <p>Staked Vote Power: {{ committees.stakedVotingPower }}</p>
                <p>Total Raw Stake: {{ committees.totalRawStaked }}</p>
              </div>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th>Address</th>
            <th>BLSKey</th>
            <th>Is Harmony Node</th>
            <th>Voting Power</th>
            <th>External Vote Power</th>
            <th>Effective Stake</th>
          </tr>
          </thead>
          <tbody>
          <tr :class="'curr-harmony-node-'+shardId+'-'+member.isHarmonySlot"
              v-for="(member, index) in committees.CommitteeMembers" :key="'current-member-'+index">
            <td>{{ member.earningAccount }}</td>
            <td>{{ member.blsPublicKey }}</td>
            <td>{{ member.isHarmonySlot }}</td>
            <td>{{ member.votingPower }}</td>
            <td>{{ member.votingPowerUnnormalized }}</td>
            <td>{{ member.effectiveStake }}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="report-wrapper" :id="'previous-committee-'+shardId"
               v-for="(committees, shardId) in superCommitteePreviousSet" :key="'previous-'+shardId">
        <input type="checkbox" :id="'prev-hn-toggle-'+shardId">
        <label :for="'prev-hn-toggle-'+shardId">show harmony nodes</label>
        <div class="summary-details">
          <div class="flex-col">
            <div class="flex-row">
              <h3>
                Shard {{ shardId }} Previous Committee <span><el-link class="link-anchor"
                                                                      @click.prevent="anchor('top-of-page')">(TOP)</el-link></span>
              </h3>
            </div>
            <div class="flex-row">
              <div class="flex-col">
                <p>Policy: {{ committees.policy }}</p>
                <p>Members: {{ committees.count }}</p>
              </div>
              <div class="flex-col">
                <p>Internal Vote Power: {{ committees.hmyVotingPower }}</p>
                <p>Staked Vote Power: {{ committees.stakedVotingPower }}</p>
                <p>Total Raw Stake: {{ committees.totalRawStaked }}</p>
              </div>
            </div>
          </div>
        </div>
        <table class="sortable-theme-bootstrap report-table" data-sortable>
          <thead>
          <tr>
            <th>Address</th>
            <th>BLSKey</th>
            <th>Is Harmony Node</th>
            <th>Voting Power</th>
            <th>External Vote Power</th>
            <th>Effective Stake</th>
          </tr>
          </thead>
          <tbody>
          <tr :class="'prev-harmony-node-'+shardId+'-'+member.isHarmonySlot"
              v-for="(member, index) in committees.CommitteeMembers" :key="'previous-member-'+index">
            <td>{{ member.earningAccount }}</td>
            <td>{{ member.blsPublicKey }}</td>
            <td>{{ member.isHarmonySlot }}</td>
            <td>{{ member.votingPower }}</td>
            <td>{{ member.votingPowerUnnormalized }}</td>
            <td>{{ member.effectiveStake }}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </main>
    <el-empty
        style="padding-top: 100px;"
        description="Please connect your wallet and login first."
        :image-size="250"
        :image="require('../assets/login-img.png')"
        v-if="userToken === ''"
    >
      <el-button
          style="margin-top: 20px;"
          type="warning"
          @click="connectWallet"
          :loading="isWalletConnecting"
      >Connect Wallet
      </el-button>
    </el-empty>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

@Component
export default class HomeView extends Vue {
  protected userToken: string = "";
  protected userName: string = "";
  protected leftTitle: string = "";
  protected versionTitle: string = "";
  protected baseConfig: BaseConfig = {chainId: 2, network: "testnet"};
  protected networkOptions: Array<NetworkOptions> = [
    {label: "Devnet", value: "devnet"},
    {label: "Testnet", value: "testnet"}
  ];
  protected shardSummarySet: Array<ShardSummary> = [];
  protected shardConfigSet: Array<ShardConfig> = [];
  protected versionSummarySet: Array<VersionSummary> = [];
  protected noReplyMachineSet: Array<NoReplyMachine> = [];
  protected shardBlockHeaderSet: Array<ShardBlockHeader> = [];
  protected versionNodeMetadataSet: Record<string, Array<VersionNodeMetadata>> = {};
  protected superCommitteeCurrentSet: Array<SuperCommitteeQuorumDecider> = [];
  protected superCommitteePreviousSet: Array<SuperCommitteeQuorumDecider> = [];
  // Web3
  protected web3Modal: any = null;
  protected walletAddress: string = "";
  protected isWalletConnecting: boolean = false;


  private async created() {
    // get auth data and network from localstorage
    const baseConfigRaw: string | null = localStorage.getItem("base_config");
    if (baseConfigRaw != null) {
      this.baseConfig = JSON.parse(baseConfigRaw) as BaseConfig;
    } else {
      localStorage.setItem("base_config", JSON.stringify(this.baseConfig));
    }

    const authDataRaw: string | null = localStorage.getItem(this.baseConfig.network + "_auth_data");
    if (authDataRaw != null) {
      const authData = JSON.parse(authDataRaw) as AuthData;
      this.userToken = authData.token;
      this.userName = authData.user_name;
      this.walletAddress = authData.user_address;
    }

  }

  private mounted() {
    if (this.userToken) {
      this.loadData();
    }

    // init web3model
    this.web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: "https://cloudflare-eth.com",
            }
          }
        }
      }
    });
  }

  private async connectWallet() {
    let provider;
    try {
      provider = await this.web3Modal.connect();
    } catch (e) {
      this.$message.error("user refuse connect the wallet");
      return
    }

    provider.on("accountsChanged", () => {
      this.cleanAuthData();

      this.$message({
        message: 'disconnect wallet success',
        showClose: true,
        type: 'success'
      });
    });

    let web3Client = new Web3(provider);
    let address: string = "";
    let sign: string = ""

    await web3Client.eth.getAccounts().then((accounts: string[]) => {
      address = accounts[0];
    }).catch((error) => {
      this.$message.error("get user wallet address failed. err: " + error.message);
    });

    if (address != "") {
      const signContent = "Welcome to Watchdog monitor system.\n\nLogin Account:\n" + address + "\n\nNonce: " + Math.round(Math.random() * 899999 + 100000);
      await web3Client.eth.personal.sign(signContent, address, "").then((res: string) => {
        sign = res;
      }).catch((error) => {
        this.$message.error("get sign failed. err: " + error.message);
      });

      if (sign != "") {
        const loginResp = await this.userLogin({
          address: address,
          sign: sign,
          sign_content: signContent
        }).catch((error) => {
          this.$message.error("login failed. err: " + error.response.data.message);
        });

        if (loginResp.token) {
          this.walletAddress = address;
          this.userName = loginResp.name;
          this.userToken = loginResp.token;
          this.$message({
            message: 'login success',
            type: 'success'
          });

          localStorage.setItem(this.baseConfig.network + "_auth_data", JSON.stringify({
            token: this.userToken,
            user_name: this.userName,
            user_address: this.walletAddress,
          }));

          await this.loadData();
        }
      }
    }
  }

  private async changeNetwork(newVal: string) {
    this.baseConfig.network = newVal;
    localStorage.setItem("base_config", JSON.stringify(this.baseConfig));

    const authDataRaw: string | null = localStorage.getItem(this.baseConfig.network + "_auth_data");
    if (authDataRaw != null) {
      const authData = JSON.parse(authDataRaw) as AuthData;
      this.userToken = authData.token;
      this.userName = authData.user_name;
      this.walletAddress = authData.user_address;

      await this.loadData();
    } else {
      this.cleanAuthData();
    }
  }

  private userLogin(loginData: UserLoginRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isWalletConnecting = true;

      this.axios.post(this.getEndpointHost(this.baseConfig.network)+'/login', loginData).then((response) => {
        if (response.status == 200 && response.data.token) {
          return resolve(response.data)
        } else {
          return reject("unexpected error")
        }
      }).catch((error) => {
        return reject(error)
      }).then(() => {
        this.isWalletConnecting = false;
      });
    });
  }

  private userLogout() {
    // clean auth data
    this.cleanAuthData();
  }

  private async loadData() {
    const networkDataResp = await this.getNetworkData(this.baseConfig.network).catch((error) => {
      if (error.response && error.response.status == 401) {
        // clean auth data
        this.cleanAuthData();
      }
      this.$message.error('load failed: ' + error);
    });


    if (networkDataResp.status == 200) {
      this.cleanNetworkData();

      this.parseNetworkData(networkDataResp.data);

      setTimeout(() => {
        Sortable.init();
      }, 1000);
    }
  }

  private getNetworkData(network: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.axios.get(this.getEndpointHost(this.baseConfig.network)+'/user/network', {
        headers: {"Authorization": "Bearer " + this.userToken},
      }).then((response) => {
        return resolve(response)
      }).catch((error) => {
        return reject(error)
      }).then(() => {
        loading.close();
      });
    });
  }

  private parseNetworkData(respData: any) {
    this.leftTitle = respData["chain-name"];
    this.versionTitle = respData["watchdog-build-version"];
    this.baseConfig.chainId = respData["summary-maps"]["chain-config"][0]["chain-id"];
    const consensusLiviness = respData["consensus-liviness"];
    const noReplyMachines = respData["no-reply-machines"];
    const blockHeader = respData["summary-maps"]["block-header"];
    const chainConfig = respData["summary-maps"]["chain-config"];
    const nodeMetadata = respData["summary-maps"]["node-metadata"];
    const superCommitteeCurrent = respData["super-committee"]["current"];
    const superCommitteePrevious = respData["super-committee"]["previous"];

    // parse shard data
    for (const shardIdStr in consensusLiviness) {
      const shardId: number = parseInt(shardIdStr);

      // get leader
      let shardLeader: string = "Unknown";
      if (blockHeader[shardId]["shard-leader"] != undefined) {
        shardLeader = blockHeader[shardId]["shard-leader"].join(", ");
      }

      // set consensus liviness
      this.shardSummarySet[shardId] = {
        consensus: consensusLiviness[shardId],
        blocksToNextEpoch: chainConfig[shardId]["next-epoch-first-block"] - blockHeader[shardId]["block-max"],
        blockMax: blockHeader[shardId]["block-max"],
        blockMin: blockHeader[shardId]["block-min"],
        epochMax: blockHeader[shardId]["epoch-max"],
        epochMin: blockHeader[shardId]["epoch-min"],
        pendingCrossLinksCount: blockHeader[shardId]["pending-cross-links-count"] ? blockHeader[shardId]["pending-cross-links-count"] : "-",
        pendingCxCount: blockHeader[shardId]["pending-cx-count"],
        leader: shardLeader,
        signPower: blockHeader[shardId]["sign-power"] * 100 + "%",
        uniqBlocks: blockHeader[shardId]["uniq-blocks"],
        uniqEpochs: blockHeader[shardId]["uniq-epochs"],
        nodeCount: blockHeader[shardId]["records"].length,
      }

      // set shard config
      this.shardConfigSet[shardId] = {
        chainId: chainConfig[shardId]["chain-id"],
        crossLinkEpoch: chainConfig[shardId]["cross-link-epoch"],
        crossTxEpoch: chainConfig[shardId]["cross-tx-epoch"],
        eip155Epoch: chainConfig[shardId]["eip155-epoch"],
        s3Epoch: chainConfig[shardId]["s3-epoch"],
        preStakingEpoch: chainConfig[shardId]["pre-staking-epoch"],
        stakingEpoch: chainConfig[shardId]["staking-epoch"],
        blocksPerEpoch: chainConfig[shardId]["blocks-per-epoch"],
        dNSZone: chainConfig[shardId]["dns-zone"],
      }
    }

    // parse version data
    for (const version in nodeMetadata) {
      this.versionSummarySet.push({
        title: version,
        nodeCount: nodeMetadata[version]["records"].length,
      });

      this.versionNodeMetadataSet[version] = [];
      for (const recordIndex in nodeMetadata[version]["records"]) {
        const record: any = nodeMetadata[version]["records"][recordIndex];
        const isArchive = (record["Payload"]["is-archival"] != undefined);
        let shortKey: string[] = [];
        for (const index in record["Payload"]["blskey"]) {
          shortKey.push(this.blskey2short(record["Payload"]["blskey"][index]))
        }

        this.versionNodeMetadataSet[version].push({
          ip: record["IP"],
          payload: {
            peerId: record["Payload"]["peerid"],
            blsKey: record["Payload"]["blskey"],
            shortBlsKey: shortKey,
            shardId: record["Payload"]["shard-id"],
            role: record["Payload"]["role"],
            nodeUnixStartTime: record["Payload"]["node-unix-start-time"],
            nodeStartTime: new Date(parseInt(record["Payload"]["node-unix-start-time"]) * 1000).toLocaleString(),
            archive: isArchive,
            syncStatus: record["Payload"]["syncStatus"],
            p2pConnectivity: {
              connected: record["Payload"]["p2p-connectivity"]["connected"],
              totalKnownPeers: record["Payload"]["p2p-connectivity"]["total-known-peers"],
              connectivity: Math.round(record["Payload"]["p2p-connectivity"]["connected"] / record["Payload"]["p2p-connectivity"]["total-known-peers"] * 100),
            },
            consensus: record["Payload"]["consensus"],
          }
        })
      }
    }

    // parse no reply machines
    if (noReplyMachines && noReplyMachines.length > 0) {
      for (const index in noReplyMachines) {
        this.noReplyMachineSet.push({
          ip: noReplyMachines[index]["IP"],
          failureReason: noReplyMachines[index]["FailureReason"],
          rpcPayload: noReplyMachines[index]["RPCPayload"],
          shardID: noReplyMachines[index]["ShardID"],
        })
      }
    }

    // parse node block header
    for (const shardIdStr in blockHeader) {
      const shardId: number = parseInt(shardIdStr);
      this.shardBlockHeaderSet[shardId] = {
        shardID: shardId,
        validators: [],
        explorers: [],
      }

      for (const recordIndex in blockHeader[shardId]["records"]) {
        const record: any = blockHeader[shardId]["records"][recordIndex];
        if (record["Payload"]["NodeType"] == "Validator") {
          this.shardBlockHeaderSet[shardId].validators.push({
            payload: record["Payload"],
            ip: record["IP"],
          });
        } else {
          this.shardBlockHeaderSet[shardId].explorers.push({
            payload: record["Payload"],
            ip: record["IP"],
          });
        }
      }
    }

    // parse current super committee
    for (const shardIdStr in superCommitteeCurrent["quorum-deciders"]) {
      const shardId: number = parseInt((shardIdStr.split('-'))[1]);
      const quorumDecider: any = superCommitteeCurrent["quorum-deciders"][shardIdStr];
      let committeeMembers: Array<QuorumDeciderCommitteeMember> = [];

      for (const memberIndex in superCommitteeCurrent["quorum-deciders"][shardIdStr]["committee-members"]) {
        const member: any = superCommitteeCurrent["quorum-deciders"][shardIdStr]["committee-members"][memberIndex];
        const effectiveStake: string = member["effective-stake"] ? member["effective-stake"] : '';
        committeeMembers.push({
          earningAccount: member["earning-account"],
          isHarmonySlot: member["is-harmony-slot"],
          blsPublicKey: member["bls-public-key"],
          votingPowerUnnormalized: member["voting-power-unnormalized"],
          votingPower: member["voting-power-%"],
          effectiveStake: effectiveStake,
        });
      }

      this.superCommitteeCurrentSet.push({
        shardId: shardId,
        policy: quorumDecider["policy"],
        count: quorumDecider["count"],
        externalValidatorSlotCount: quorumDecider["external-validator-slot-count"],
        CommitteeMembers: committeeMembers,
        hmyVotingPower: quorumDecider["hmy-voting-power"],
        stakedVotingPower: quorumDecider["staked-voting-power"],
        totalRawStaked: quorumDecider["total-raw-staked"],
      })
    }

    // parse previous super committee
    for (const shardIdStr in superCommitteePrevious["quorum-deciders"]) {
      const shardId: number = parseInt((shardIdStr.split('-'))[1]);
      const quorumDecider: any = superCommitteePrevious["quorum-deciders"][shardIdStr];
      let committeeMembers: Array<QuorumDeciderCommitteeMember> = [];

      for (const memberIndex in superCommitteePrevious["quorum-deciders"][shardIdStr]["committee-members"]) {
        const member: any = superCommitteePrevious["quorum-deciders"][shardIdStr]["committee-members"][memberIndex];
        const effectiveStake: string = member["effective-stake"] ? member["effective-stake"] : '';
        committeeMembers.push({
          earningAccount: member["earning-account"],
          isHarmonySlot: member["is-harmony-slot"],
          blsPublicKey: member["bls-public-key"],
          votingPowerUnnormalized: member["voting-power-unnormalized"],
          votingPower: member["voting-power-%"],
          effectiveStake: effectiveStake,
        });
      }

      this.superCommitteePreviousSet.push({
        shardId: shardId,
        policy: quorumDecider["policy"],
        count: quorumDecider["count"],
        externalValidatorSlotCount: quorumDecider["external-validator-slot-count"],
        CommitteeMembers: committeeMembers,
        hmyVotingPower: quorumDecider["hmy-voting-power"],
        stakedVotingPower: quorumDecider["staked-voting-power"],
        totalRawStaked: quorumDecider["total-raw-staked"],
      })
    }
  }

  private cleanNetworkData() {
    this.versionTitle = "";
    this.shardSummarySet = [];
    this.shardConfigSet = [];
    this.versionSummarySet = [];
    this.noReplyMachineSet = [];
    this.shardBlockHeaderSet = [];
    this.versionNodeMetadataSet = {};
    this.superCommitteeCurrentSet = [];
    this.superCommitteePreviousSet = [];
  }

  private cleanAuthData() {
    localStorage.removeItem(this.baseConfig.network + "_auth_data");
    this.userToken = "";
    this.userName = "";
    this.walletAddress = "";
  }

  private downloadCSV(url: string) {
    window.location.href = url;
  }

  private anchor(anchorName: string) {
    let anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView();
    }
  }

  private blskey2short(key: string): string {
    return key.slice(0, 3) + "..." + key.slice(-3);
  }

  private getEndpointHost(network: string): string {
    switch (network) {
      case "mainnet":
        return "https://api.watchdog.t.hmny.io/"+network
      case "testnet":
      case "devnet":
      default:
        return "https://api.watchdog.b.hmny.io/"+network
    }
  }
}
</script>

<style scoped>
a.link-anchor {
  font-size: 17px;
  color: #0e2eff;
}

a.link-anchor:hover {
  color: #154c84;
}

a.link-anchor.is-underline:hover:after {
  border-color: #154c84;
}

.report-wrapper {
  padding: 17px 17px 30px;
  background-color: #344E4F;
}

.report-wrapper > label {
  color: #AFCAC5;
}

.report-table {
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
}

.report-descr {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  justify-content: space-between;
}

.build-stat {
  background-color: #E0EFC7;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.build-stat-values {
  font-size: 15px;
  font-weight: bolder;
}

.title-username {
  font-size: 15px;
  font-weight: bolder;
  line-height: 40px;
  margin-right: 20px;
}

.summary-details {
  background-color: #7F9A95;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 10px;
  height: 95px;
}

.align-right {
  text-align: right;
}

.space-between {
  justify-content: space-between;
  width: 100%
}

.is-leader {
  background-color: #c4b8b178;
}

.center {
  align-items: center;
}

.stat-box {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.9);
  padding: 10px;
  background-color: #7F9A95;
}

.stat-field {
  display: flex;
  justify-content: space-between;
}

.flex-both {
  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 670px) {
  .flex-both {
    display: flex;
    flex-direction: row;
  }
}

th {
  background: #c9d1ac;
  position: sticky;
  top: 91px;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}

hr {
  overflow: visible; /* For IE */
  padding: 0;
  border: none;
  border-top: medium double #333;
  color: #333;
  text-align: center;
  height: 0;
}

hr:after {
  content: "§";
  display: inline-block;
  position: relative;
  top: -0.7em;
  font-size: 1.5em;
  padding: 0 0.25em;
}

.stat-box > p {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stat-box p span:first-child {
  margin-right: 10px;
}

#curr-hn-toggle-0:checked ~ * .curr-harmony-node-0-true,
#curr-hn-toggle-1:checked ~ * .curr-harmony-node-1-true,
#curr-hn-toggle-2:checked ~ * .curr-harmony-node-2-true,
#curr-hn-toggle-3:checked ~ * .curr-harmony-node-3-true,
#prev-hn-toggle-0:checked ~ * .prev-harmony-node-0-true,
#prev-hn-toggle-1:checked ~ * .prev-harmony-node-1-true,
#prev-hn-toggle-2:checked ~ * .prev-harmony-node-2-true,
#prev-hn-toggle-3:checked ~ * .prev-harmony-node-3-true {
  display: table-row;
}

#curr-hn-toggle-0:not(checked) ~ * .curr-harmony-node-0-true,
#curr-hn-toggle-1:not(checked) ~ * .curr-harmony-node-1-true,
#curr-hn-toggle-2:not(checked) ~ * .curr-harmony-node-2-true,
#curr-hn-toggle-3:not(checked) ~ * .curr-harmony-node-3-true,
#prev-hn-toggle-0:not(checked) ~ * .prev-harmony-node-0-true,
#prev-hn-toggle-1:not(checked) ~ * .prev-harmony-node-1-true,
#prev-hn-toggle-2:not(checked) ~ * .prev-harmony-node-2-true,
#prev-hn-toggle-3:not(checked) ~ * .prev-harmony-node-3-true {
  display: none;
}
</style>
