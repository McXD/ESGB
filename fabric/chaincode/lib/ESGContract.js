'use strict';

const { Contract } = require('fabric-contract-api');

class ESGContract extends Contract {

  // Initialize ledger with empty data (optional)
  async initLedger(ctx) {
    console.log('ESG Contract Initialized');
  }

  // Submit ESG Data
  async submitESGData(ctx, id, companyName, category, metricValue, submissionDate, fileHash) {
    const exists = await this._esgDataExists(ctx, id);
    if (exists) {
      throw new Error(`ESG data with ID ${id} already exists`);
    }

    const esgData = {
      id,
      companyName,
      category,
      metricValue,
      submissionDate,
      fileHash, // Hash of the uploaded file for data integrity
      status: 'Pending', // Initial status as "Pending"
      signedOffBy: null,
      rejectedBy: null,
      auditTrail: []
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(esgData)));

    // Emit event after submission
    ctx.stub.setEvent('ESGDataSubmitted', Buffer.from(JSON.stringify(esgData)));

    return JSON.stringify(esgData);
  }

  // Sign off ESG Data (auditor signs off)
  async signOffESGData(ctx, id, auditorName) {
    const esgData = await this._getESGData(ctx, id);

    if (esgData.status !== 'Pending') {
      throw new Error(`Cannot sign off ESG data with status ${esgData.status}`);
    }

    esgData.status = 'Signed Off';
    esgData.signedOffBy = auditorName;
    esgData.auditTrail.push({
      action: 'Signed Off',
      by: auditorName,
    });

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(esgData)));

    // Emit event after sign-off
    ctx.stub.setEvent('ESGDataSignedOff', Buffer.from(JSON.stringify(esgData)));

    return JSON.stringify(esgData);
  }

  // Reject ESG Data (auditor rejects)
  async rejectESGData(ctx, id, auditorName, reason) {
    const esgData = await this._getESGData(ctx, id);

    if (esgData.status !== 'Pending') {
      throw new Error(`Cannot reject ESG data with status ${esgData.status}`);
    }

    esgData.status = 'Rejected';
    esgData.rejectedBy = auditorName;
    esgData.rejectionReason = reason;
    esgData.auditTrail.push({
      action: 'Rejected',
      by: auditorName,
      reason: reason,
    });

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(esgData)));

    // Emit event after rejection
    ctx.stub.setEvent('ESGDataRejected', Buffer.from(JSON.stringify(esgData)));

    return JSON.stringify(esgData);
  }

  // Query ESG Data by ID
  async queryESGData(ctx, id) {
    const esgData = await this._getESGData(ctx, id);
    return JSON.stringify(esgData);
  }

  // Get ESG Data by ID (internal helper function)
  async _getESGData(ctx, id) {
    const dataAsBytes = await ctx.stub.getState(id);
    if (!dataAsBytes || dataAsBytes.length === 0) {
      throw new Error(`ESG data with ID ${id} does not exist`);
    }
    return JSON.parse(dataAsBytes.toString());
  }

  // Check if ESG data exists (internal helper function)
  async _esgDataExists(ctx, id) {
    const dataAsBytes = await ctx.stub.getState(id);
    return dataAsBytes && dataAsBytes.length > 0;
  }

  // Retrieve all ESG data records from the ledger
  async queryAllESGData(ctx) {
    const startKey = '';
    const endKey = '';
    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
      const res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        const record = {};
        record.key = res.value.key; // Get the ESG data key (ID)

        try {
          record.value = JSON.parse(res.value.value.toString('utf8')); // Parse the ESG data JSON
        } catch (err) {
          console.log(err);
          record.value = res.value.value.toString('utf8');
        }
        allResults.push(record);
      }

      if (res.done) {
        await iterator.close();
        return JSON.stringify(allResults);
      }
    }
  }

  async getHistoryForRecord(ctx, recordId) {
    const resultsIterator = await ctx.stub.getHistoryForKey(recordId);
    const history = [];

    while (true) {
      const res = await resultsIterator.next();

      if (res.value) {
        const record = {
          txId: res.value.txId,
          timestamp: res.value.timestamp,
          isDeleted: res.value.isDelete,
          value: null
        };

        if (res.value.value.toString()) {
          record.value = JSON.parse(res.value.value.toString('utf8'));
        }
        history.push(record);
      }

      if (res.done) {
        await resultsIterator.close();
        break;
      }
    }

    return JSON.stringify(history);
  }
}

module.exports = ESGContract;
